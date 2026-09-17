import { useCallback, useEffect, useRef, useState } from "react";
import {
  deleteVote,
  fetchMyVotes,
  fetchRatings,
  submitVote,
  voteErrorMessage,
} from "./lib/votes.js";

export default function useVotes() {
  const [averages, setAverages] = useState({});
  const [myVotes, setMyVotes] = useState({});
  const [status, setStatus] = useState("loading");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const generation = useRef(0);
  const busy = useRef(false);
  const mounted = useRef(false);

  const refresh = useCallback(async () => {
    if (busy.current) return;
    const current = ++generation.current;
    try {
      const [nextAverages, nextVotes] = await Promise.all([
        fetchRatings(),
        fetchMyVotes(),
      ]);
      if (mounted.current && current === generation.current) {
        setAverages(nextAverages);
        setMyVotes(nextVotes);
        setStatus("ready");
      }
    } catch {
      if (mounted.current && current === generation.current) setStatus("error");
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    refresh();
    const updateVisiblePage = () => {
      if (!document.hidden) refresh();
    };
    // Refresh shared averages without requiring a reload on another device.
    const interval = setInterval(updateVisiblePage, 30000);
    window.addEventListener("focus", updateVisiblePage);
    window.addEventListener("online", updateVisiblePage);
    document.addEventListener("visibilitychange", updateVisiblePage);
    return () => {
      mounted.current = false;
      generation.current++;
      clearInterval(interval);
      window.removeEventListener("focus", updateVisiblePage);
      window.removeEventListener("online", updateVisiblePage);
      document.removeEventListener("visibilitychange", updateVisiblePage);
    };
  }, [refresh]);

  const save = async (toolId, rating) => {
    if (busy.current) return false;
    busy.current = true;
    generation.current++;
    setPending(true);
    setError("");
    try {
      if (rating === null) await deleteVote(toolId);
      else await submitVote(toolId, rating);
      if (mounted.current)
        setMyVotes((previous) => {
          const next = { ...previous };
          if (rating === null) delete next[toolId];
          else next[toolId] = rating;
          return next;
        });
      // An aggregate refresh failure must not turn a saved vote into a failure.
      try {
        const nextAverages = await fetchRatings();
        if (mounted.current) {
          setAverages(nextAverages);
          setStatus("ready");
        }
      } catch {
        if (mounted.current) setStatus("error");
      }
      return true;
    } catch (cause) {
      if (mounted.current) setError(voteErrorMessage(cause));
      return false;
    } finally {
      busy.current = false;
      if (mounted.current) setPending(false);
    }
  };

  return { averages, myVotes, status, pending, error, refresh, save };
}
