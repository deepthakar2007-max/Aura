export default function ProductFilterSidebar({
  categories,
  selectedCategories,
  onToggleCategory,
  inStockOnly,
  onToggleInStock,
  priceRange,
  onPriceChange,
  onReset,
}) {
  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="flex items-center justify-between mb-6">
        <p className="font-medium text-ink flex items-center gap-2">
          ⚏ Filters
        </p>
        <button
          onClick={onReset}
          className="text-xs text-ink/40 underline hover:text-ink"
        >
          Reset All
        </button>
      </div>

      <label className="flex items-center justify-between mb-8 cursor-pointer">
        <span className="text-sm text-ink">In Stock Only</span>
        <input
          type="checkbox"
          checked={inStockOnly}
          onChange={onToggleInStock}
          className="accent-ink w-4 h-4"
        />
      </label>

      <div className="mb-8">
        <p className="text-xs tracking-widest uppercase text-ink/40 mb-3">
          Categories
        </p>
        <div className="space-y-2.5">
          {categories.map((cat) => (
            <label
              key={cat._id}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat.name)}
                onChange={() => onToggleCategory(cat.name)}
                className="accent-ink w-4 h-4"
              />
              <span className="text-sm text-ink/70 capitalize">{cat.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs tracking-widest uppercase text-ink/40 mb-3">
          Price Range
        </p>
        <input
          type="range"
          min="0"
          max="10000"
          step="100"
          value={priceRange}
          onChange={(e) => onPriceChange(Number(e.target.value))}
          className="w-full accent-ink"
        />
        <div className="flex justify-between text-xs text-ink/50 mt-2">
          <span>$0</span>
          <span className="font-medium text-ink">${priceRange}+</span>
        </div>
      </div>
    </aside>
  );
}
