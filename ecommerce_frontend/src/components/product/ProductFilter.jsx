export default function ProductFilter({
  category,
  onCategoryChange,
  search,
  onSearchChange,
}) {
  const categories = ["", "men", "women", "kids", "electronics", "accessories"];

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      <input
        type="text"
        placeholder="Search products…"
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="flex-1 rounded-lg border border-ink/15 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
      />
      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        className="rounded-lg border border-ink/15 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
      >
        {categories.map((c) => (
          <option key={c} value={c}>
            {c === "" ? "All categories" : c}
          </option>
        ))}
      </select>
    </div>
  );
}
