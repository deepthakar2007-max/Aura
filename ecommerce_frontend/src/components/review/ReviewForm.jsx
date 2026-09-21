import { useState } from "react";
import StarRating from "./StarRating";

export default function ReviewForm({ onSubmit }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!rating) {
      setError("Please select a rating");
      return;
    }
    setBusy(true);
    try {
      await onSubmit({ rating, review: text });
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setRating(0);
        setText("");
      }, 1800);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (submitted) {
    return (
      <div className="border border-green-200 bg-green-50 rounded-xl p-6 flex flex-col items-center gap-2 animate-[popIn_0.4s_ease-out]">
        <div className="w-12 h-12 rounded-full bg-green-500 text-white flex items-center justify-center text-2xl animate-[bounceIn_0.5s_ease-out]">
          ✓
        </div>
        <p className="text-green-700 font-medium">Thanks for your review!</p>
        <style>{`
          @keyframes popIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
          @keyframes bounceIn { 0% { transform: scale(0); } 60% { transform: scale(1.2); } 100% { transform: scale(1); } }
        `}</style>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-ink/10 rounded-xl p-5 space-y-3"
    >
      <p className="text-sm font-medium text-ink">Rate this product</p>
      <StarRating
        rating={rating}
        size="text-2xl"
        interactive
        onChange={setRating}
        hovered={hovered}
        onHover={setHovered}
      />
      <textarea
        placeholder="Share your experience with this product…"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={3}
        className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand resize-none"
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={busy}
        className="bg-brandDark text-paper px-5 py-2 rounded-lg text-sm hover:bg-brand transition-colors disabled:opacity-50"
      >
        {busy ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
