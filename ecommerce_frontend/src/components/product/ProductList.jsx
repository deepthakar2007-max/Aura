import ProductCard from "./ProductCard";

export default function ProductList({ products, loading, error }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] bg-ink/5 rounded-2xl animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 text-center py-16">{error}</p>;
  }

  if (!products.length) {
    return <p className="text-ink/50 text-center py-16">No products found.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
