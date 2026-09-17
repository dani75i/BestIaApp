import { useRef, useState } from "react";
import { getVoter, supabase } from "./lib/votes.js";

export default function FeedbackForm() {
  const [category, setCategory] = useState("suggestion");
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [state, setState] = useState("idle");
  const busy = useRef(false);
  const trap = useRef(null);
  const pagePath = useRef((location.pathname + location.hash).slice(0, 300));
  async function submit(event) {
    event.preventDefault();
    if (busy.current) return;
    setError("");
    if (trap.current.value || message.trim().length < 10) {
      setError("Votre message doit contenir au moins 10 caractères.");
      return;
    }
    busy.current = true;
    setState("sending");
    try {
      await getVoter();
      const { error } = await supabase.rpc("submit_feedback", {
        p_category: category,
        p_message: message.trim(),
        p_email: email.trim() || null,
        p_page_path: pagePath.current,
      });
      if (error) throw error;
      setState("sent");
    } catch (err) {
      setState("idle");
      setError(
        err.message?.includes("feedback_rate_limit")
          ? "Veuillez patienter avant un nouvel envoi : un message par minute et cinq par jour maximum."
          : "Votre message n’a pas pu être envoyé. Il est conservé ici : vous pouvez réessayer.",
      );
    } finally {
      busy.current = false;
    }
  }
  return (
    <div className="feedback-form">
      <p className="section-eyebrow">CONSTRUISONS BESTIA ENSEMBLE</p>
      <h2 id="feedback-title">Votre avis sur BestIA</h2>
      {state === "sent" ? (
        <div role="status" className="feedback-success">
          <h3>Merci pour votre retour !</h3>
          <p>Votre message a été transmis au responsable de BestIA.</p>
        </div>
      ) : (
        <form onSubmit={submit}>
          <p>
            Une idée, un problème ou une remarque ? Votre message reste privé.
          </p>
          <label htmlFor="feedback-category">Type de retour</label>
          <select
            id="feedback-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            disabled={state === "sending"}
          >
            <option value="suggestion">Une suggestion</option>
            <option value="problem">Un problème</option>
            <option value="general">Une remarque générale</option>
          </select>
          <label htmlFor="feedback-message">Votre message</label>
          <textarea
            id="feedback-message"
            required
            minLength={10}
            maxLength={3000}
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            disabled={state === "sending"}
            placeholder="Dites-nous ce qui vous aiderait…"
            aria-describedby="feedback-length"
          />
          <small id="feedback-length">
            10 caractères minimum · {message.length}/3 000
          </small>
          <label htmlFor="feedback-email">
            Votre e-mail <span>(facultatif)</span>
          </label>
          <input
            id="feedback-email"
            type="email"
            maxLength={254}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={state === "sending"}
            autoComplete="email"
          />
          <small>Uniquement pour vous répondre au sujet de ce retour.</small>
          <div className="feedback-trap" aria-hidden="true">
            <label>
              Site web
              <input ref={trap} tabIndex={-1} autoComplete="off" />
            </label>
          </div>
          {error && <p role="alert">{error}</p>}
          <button
            type="submit"
            className="primary-button"
            disabled={state === "sending"}
          >
            {state === "sending" ? "Envoi en cours…" : "Envoyer mon retour"}
          </button>
          <p className="source-note">
            Le message et la page concernée sont transmis à BestIA. Aucun compte
            à créer.
          </p>
        </form>
      )}
    </div>
  );
}
