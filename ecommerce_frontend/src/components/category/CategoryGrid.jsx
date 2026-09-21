export default function CategoryGrid({ categories, selected, onSelect }) {
  return (
    <div className="flex gap-4 overflow-x-auto pb-2 mb-8 scrollbar-none">
      <button
        onClick={() => onSelect("")}
        className={`flex-shrink-0 flex flex-col items-center gap-2 group`}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center border-2 transition-colors ${
            selected === ""
              ? "border-brand bg-brand/10"
              : "border-ink/10 group-hover:border-ink/30"
          }`}
        >
          <span className="text-xl">✦</span>
        </div>
        <span
          className={`text-xs ${selected === "" ? "text-brandDark font-medium" : "text-ink/60"}`}
        >
          All
        </span>
      </button>

      {categories.map((cat) => (
        <button
          key={cat._id}
          onClick={() => onSelect(cat.name)}
          className="flex-shrink-0 flex flex-col items-center gap-2 group"
        >
          <div
            className={`w-16 h-16 rounded-full overflow-hidden border-2 transition-colors ${
              selected === cat.name
                ? "border-brand"
                : "border-ink/10 group-hover:border-ink/30"
            }`}
          >
            <img
              src={cat.img}
              alt={cat.name}
              className="w-full h-full object-cover"
            />
          </div>
          <span
            className={`text-xs capitalize ${selected === cat.name ? "text-brandDark font-medium" : "text-ink/60"}`}
          >
            {cat.name}
          </span>
        </button>
      ))}
    </div>
  );
}
