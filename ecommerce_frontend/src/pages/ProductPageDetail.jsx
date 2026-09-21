import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "motion/react";
import { getProductById } from "../api/productApi";
import { getReviews, addReview } from "../api/reviewApi";
import { useCart } from "../hooks/useCart";
import { useWishlist } from "../hooks/useWishlist";
import { useAuth } from "../hooks/useAuth";
import ProductGallery from "../components/product/ProductGallery";
import ReviewSummary from "../components/review/ReviewSummary";
import ReviewForm from "../components/review/ReviewForm";
import ReviewList from "../components/review/ReviewList";
import RelatedProducts from "../components/product/RelatedProducts";
import ScrollReveal from "../components/animations/ScrollReveal";
import FadeUp from "../components/animations/FadeUp";
import AnimatedButton from "../components/animations/AnimatedButton";

export default function ProductPageDetail() {
  const { id } = useParams();
  const { token, user } = useAuth();
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist, refreshWishlist } = useWishlist();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadReviews = () => {
    getReviews(id)
      .then((res) => setReviews(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    setLoading(true);
    getProductById(id)
      .then((res) => setProduct(res.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    loadReviews();
  }, [id]);

  useEffect(() => {
    if (token) refreshWishlist();
  }, [token, refreshWishlist]);

  const handleAddToCart = async () => {
    if (!token) return navigate("/login");
    try {
      await addItem(product._id, qty);
      setMessage("Added to cart ✅");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleBuyNow = async () => {
    if (!token) return navigate("/login");
    try {
      await addItem(product._id, qty);
      navigate("/checkout");
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleToggleWishlist = async () => {
    if (!token) return navigate("/login");
    try {
      await toggleWishlist(product._id);
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleReviewSubmit = async ({ rating, review }) => {
    if (!token) return navigate("/login");
    await addReview({ user: user._id, product: id, rating, review });
    loadReviews();
  };

  const avgRating = reviews.length
    ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
    : 0;
  const badge =
    product && product.stock > 0 && product.stock < 5
      ? "Limited Edition"
      : null;

  if (loading) return <p className="text-center py-20 text-ink/50">Loading…</p>;
  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => navigate("/shop")}
          className="mt-4 text-brandDark underline"
        >
          Back to shop
        </button>
      </div>
    );
  }
  if (!product) return null;

  return (
    <div>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-8">
        <p className="text-xs text-ink/40 mb-6">
          <Link to="/" className="hover:text-ink">
            Home
          </Link>{" "}
          / <span className="capitalize">{product.category}</span> /{" "}
          {product.name}
        </p>

        {message && (
          <p className="mb-6 text-sm bg-green-50 text-green-700 border border-green-200 rounded-lg px-4 py-2">
            {message}
          </p>
        )}

        <div className="grid md:grid-cols-2 gap-14">
          <FadeUp>
            <ProductGallery img={product.img} badge={badge} />
          </FadeUp>

          <FadeUp delay={0.15}>
            <p className="text-xs tracking-widest uppercase text-accent mb-2">
              {product.category}
            </p>
            <h1 className="font-display text-3xl text-ink leading-tight">
              {product.name}
            </h1>

            {reviews.length > 0 && (
              <div className="flex items-center gap-2 mt-3">
                <span className="text-accent text-sm">
                  {"★".repeat(Math.round(avgRating))}
                  {"☆".repeat(5 - Math.round(avgRating))}
                </span>
                <span className="text-sm text-ink/50">
                  {avgRating.toFixed(1)} / 5.0 ({reviews.length} Verified
                  Reviews)
                </span>
              </div>
            )}

            <p className="font-display text-3xl text-ink mt-6">
              ${product.price}
            </p>

            <p className="text-sm text-ink/60 mt-4 leading-relaxed max-w-md">
              {product.description}
            </p>

            <p
              className={`mt-4 text-sm ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>

            <div className="flex items-center gap-4 mt-8">
              <div className="flex items-center border border-ink/15">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-10 h-11 hover:bg-cream"
                >
                  -
                </button>
                <span className="w-10 text-center text-sm">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="w-10 h-11 hover:bg-cream"
                >
                  +
                </button>
              </div>
              <AnimatedButton
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="flex-1 bg-ink text-white text-xs tracking-widest uppercase py-3.5 hover:bg-ink/80 transition-colors disabled:opacity-40"
              >
                Add to Cart
              </AnimatedButton>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.8 }}
                onClick={handleToggleWishlist}
                className={`w-11 h-11 flex items-center justify-center border transition-colors ${
                  isWishlisted(product._id)
                    ? "border-accent text-accent"
                    : "border-ink/15 hover:border-accent"
                }`}
              >
                {isWishlisted(product._id) ? "♥" : "♡"}
              </motion.button>
            </div>

            <AnimatedButton
              onClick={handleBuyNow}
              disabled={product.stock === 0}
              className="w-full mt-3 bg-accent text-ink text-xs tracking-widest uppercase py-3.5 hover:bg-accent/80 transition-colors disabled:opacity-40"
            >
              Instant Secure Checkout
            </AnimatedButton>

            <div className="mt-8 space-y-4">
              <div className="flex gap-3 bg-cream/60 p-4">
                <span>🚚</span>
                <div>
                  <p className="text-sm font-medium text-ink">
                    Complimentary White-Glove Delivery
                  </p>
                  <p className="text-xs text-ink/50 mt-0.5">
                    Insured express shipping with signature requirement. Arrives
                    within 2–3 business days.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 bg-cream/60 p-4">
                <span>🛡️</span>
                <div>
                  <p className="text-sm font-medium text-ink">
                    5-Year International AURA Warranty
                  </p>
                  <p className="text-xs text-ink/50 mt-0.5">
                    Includes annual servicing and complete mechanical coverage.
                  </p>
                </div>
              </div>
            </div>
          </FadeUp>
        </div>
      </div>

      <ScrollReveal>
        <div className="bg-cream/40 py-16 mt-14">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <p className="text-xs tracking-widest uppercase text-accent text-center mb-2">
              Uncompromising Excellence
            </p>
            <h2 className="font-display text-2xl text-ink text-center mb-10">
              Designed for the Exceptional
            </h2>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                [
                  "Premium Craftsmanship",
                  "Every piece undergoes rigorous quality checks before it reaches you.",
                ],
                [
                  "Curated Materials",
                  "Sourced from trusted global ateliers for lasting quality.",
                ],
                [
                  "Lasting Durability",
                  "Built to remain a part of your life for years to come.",
                ],
              ].map(([title, desc]) => (
                <div key={title} className="bg-white p-6">
                  <p className="font-medium text-ink mb-2">{title}</p>
                  <p className="text-sm text-ink/50 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <div className="max-w-4xl mx-auto px-5 sm:px-8 py-16">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-display text-2xl text-ink">
              Client Reviews & Testimonials
            </h2>
          </div>
          <p className="text-sm text-ink/50 mb-8">
            Based on {reviews.length} verified reviews.
          </p>

          <ReviewSummary reviews={reviews} />

          <div className="mt-10">
            <ReviewForm onSubmit={handleReviewSubmit} />
          </div>
          <div className="mt-8">
            <ReviewList reviews={reviews} />
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal>
        <RelatedProducts category={product.category} excludeId={product._id} />
      </ScrollReveal>
    </div>
  );
}
