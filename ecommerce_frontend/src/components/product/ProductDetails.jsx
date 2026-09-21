export default function ProductDetails({
  product,
  onAddToCart,
  onToggleWishlist,
  wishlisted,
}) {
  return (
    <div className="grid md:grid-cols-2 gap-12">
      <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-ink/10">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-accent">
          {product.category}
        </p>
        <h1 className="font-display text-4xl text-brandDark mt-2">
          {product.name}
        </h1>
        <p className="text-2xl font-medium text-ink mt-4">₹{product.price}</p>
        <p className="text-ink/60 mt-4 leading-relaxed max-w-md">
          {product.description}
        </p>

        <p
          className={`mt-4 text-sm ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
        >
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>

        <div className="flex gap-3 mt-8">
          <button
            onClick={onAddToCart}
            disabled={product.stock === 0}
            className="flex-1 bg-brandDark text-paper py-3 rounded-lg hover:bg-brand transition-colors disabled:opacity-40"
          >
            Add to cart
          </button>
          <button
            onClick={onToggleWishlist}
            className={`px-5 py-3 rounded-lg border transition-colors ${
              wishlisted
                ? "border-accent text-accent bg-accent/10"
                : "border-ink/15 hover:border-accent hover:text-accent"
            }`}
          >
            {wishlisted ? "♥ Wishlisted" : "♡ Wishlist"}
          </button>
        </div>
      </div>
    </div>
  );
}
