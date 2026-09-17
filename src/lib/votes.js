import { createClient } from "@supabase/supabase-js";
import { supabaseUrl, supabasePublishableKey } from "../config/supabase.js";

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
  },
  global: {
    fetch: (input, init = {}) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 12000);
      const relayAbort = () => controller.abort();
      init.signal?.addEventListener("abort", relayAbort, { once: true });
      if (init.signal?.aborted) controller.abort();
      return fetch(input, { ...init, signal: controller.signal }).finally(
        () => {
          clearTimeout(timer);
          init.signal?.removeEventListener("abort", relayAbort);
        },
      );
    },
  },
});

let signInPromise;
export async function getVoter() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  if (data.session) return data.session.user;
  // One anonymous account at most when several clicks happen together.
  if (!signInPromise) {
    signInPromise = supabase.auth
      .signInAnonymously()
      .then(({ data, error }) => {
        if (error) throw error;
        return data.user;
      })
      .finally(() => {
        signInPromise = undefined;
      });
  }
  return signInPromise;
}

export async function fetchRatings() {
  const { data, error } = await supabase.rpc("get_tool_ratings");
  if (error) throw error;
  return Object.fromEntries(
    (data || []).map((row) => [
      row.tool_id,
      {
        average: Number(row.average_rating),
        count: Number(row.vote_count),
      },
    ]),
  );
}

export async function fetchMyVotes() {
  const { data: sessionData, error: sessionError } =
    await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!sessionData.session) return {};
  const { data, error } = await supabase
    .from("tool_votes")
    .select("tool_id,rating")
    .eq("user_id", sessionData.session.user.id);
  if (error) throw error;
  return Object.fromEntries(
    (data || []).map((row) => [row.tool_id, row.rating]),
  );
}

export async function submitVote(toolId, rating) {
  if (!Number.isInteger(rating) || rating < 1 || rating > 5)
    throw new Error("Note invalide.");
  const voter = await getVoter();
  const { data, error } = await supabase
    .from("tool_votes")
    .upsert(
      { tool_id: toolId, user_id: voter.id, rating },
      { onConflict: "tool_id,user_id" },
    )
    .select("tool_id,rating")
    .single();
  if (error) throw error;
  return data.rating;
}

export async function deleteVote(toolId) {
  const { data, error: sessionError } = await supabase.auth.getSession();
  if (sessionError) throw sessionError;
  if (!data.session)
    throw new Error("Votre session a expiré. Rechargez la page.");
  const { error } = await supabase
    .from("tool_votes")
    .delete()
    .eq("tool_id", toolId)
    .eq("user_id", data.session.user.id);
  if (error) throw error;
}

export function voteErrorMessage(error) {
  if (error?.code === "anonymous_provider_disabled")
    return "Le vote sans compte n’est pas encore activé. Réessayez plus tard.";
  if (error?.status === 429 || error?.code === "over_request_rate_limit")
    return "Trop de tentatives. Patientez un instant avant de réessayer.";
  if (error?.code === "captcha_failed")
    return "La vérification du vote est indisponible. Réessayez plus tard.";
  return "Votre vote n’a pas pu être enregistré. Vérifiez votre connexion et réessayez.";
}
