export default function StarRating({
  rating,
  size = "text-base",
  interactive = false,
  onChange,
  hovered,
  onHover,
}) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <div className="flex gap-0.5">
      {stars.map((star) => {
        const filled = interactive
          ? star <= (hovered || rating)
          : star <= rating;
        return (
          <span
            key={star}
            onClick={() => interactive && onChange(star)}
            onMouseEnter={() => interactive && onHover(star)}
            onMouseLeave={() => interactive && onHover(0)}
            className={`${size} ${interactive ? "cursor-pointer" : ""} transition-transform ${
              interactive && hovered === star ? "scale-125" : ""
            } ${filled ? "text-accent" : "text-ink/15"}`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
