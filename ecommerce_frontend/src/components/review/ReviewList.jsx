import StarRating from "./StarRating";

export default function ReviewList({ reviews }) {
  if (!reviews.length) {
    return (
      <p className="text-ink/50 text-sm py-6 text-center border border-dashed border-ink/15 rounded-xl">
        No reviews yet. Be the first to share your thoughts!
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((r, idx) => (
        <div
          key={r._id}
          className="border-b border-ink/10 pb-4 opacity-0 animate-[fadeUp_0.4s_ease-out_forwards]"
          style={{ animationDelay: `${idx * 80}ms` }}
        >
          <div className="flex items-center justify-between mb-1">
            <p className="font-medium text-ink text-sm">
              {r.user?.username || "Anonymous"}
            </p>
            <span className="text-xs text-ink/40">
              {new Date(r.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
          <StarRating rating={r.rating} size="text-sm" />
          {r.review && (
            <p className="text-sm text-ink/70 mt-2 leading-relaxed">
              {r.review}
            </p>
          )}
        </div>
      ))}

      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}
