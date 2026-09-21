export default function ReviewSummary({ reviews }) {
  const total = reviews.length;
  const avg = total ? reviews.reduce((s, r) => s + r.rating, 0) / total : 0;
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <div className="grid sm:grid-cols-2 gap-8 bg-cream/60 p-8">
      <div className="flex flex-col items-center justify-center text-center">
        <p className="font-display text-5xl text-ink">{avg.toFixed(1)}</p>
        <div className="text-accent text-lg my-2">
          {"★".repeat(Math.round(avg))}
          {"☆".repeat(5 - Math.round(avg))}
        </div>
        <p className="text-xs text-ink/50">Overall Rating Across All Metrics</p>
      </div>
      <div className="space-y-2">
        {counts.map(({ star, count }) => (
          <div key={star} className="flex items-center gap-3 text-xs">
            <span className="w-10 text-ink/60">{star} Star</span>
            <div className="flex-1 h-1.5 bg-ink/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent"
                style={{ width: total ? `${(count / total) * 100}%` : "0%" }}
              />
            </div>
            <span className="w-6 text-ink/40 text-right">{count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
