import { Link } from "react-router-dom";
import CouponBox from "../coupon/CouponBox";

const FREE_SHIP_THRESHOLD = 1000;
const TAX_RATE = 0.08;

export default function CartSummary({
  totalPrice,
  appliedCoupon,
  onApplyCoupon,
}) {
  let discount = 0;
  if (appliedCoupon) {
    discount =
      appliedCoupon.discountType === "PERCENTAGE"
        ? (totalPrice * appliedCoupon.discount) / 100
        : appliedCoupon.discount;
  }

  const afterDiscount = Math.max(0, totalPrice - discount);
  const freeShip = afterDiscount >= FREE_SHIP_THRESHOLD;
  const shipping = freeShip ? 0 : 99;
  const taxes = afterDiscount * TAX_RATE;
  const grandTotal = afterDiscount + shipping + taxes;

  const remaining = Math.max(0, FREE_SHIP_THRESHOLD - afterDiscount);
  const progress = Math.min(100, (afterDiscount / FREE_SHIP_THRESHOLD) * 100);

  return (
    <div className="bg-cream/60 p-8 h-fit sticky top-24 space-y-6">
      <h3 className="font-display text-2xl text-ink">Order Summary</h3>

      <CouponBox
        orderTotal={totalPrice}
        onApply={onApplyCoupon}
        appliedCoupon={appliedCoupon}
      />

      <div className="space-y-3 text-sm">
        <div className="flex justify-between text-ink/70">
          <span>Subtotal</span>
          <span>${totalPrice.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>−${discount.toFixed(2)}</span>
          </div>
        )}
        <div className="flex justify-between text-ink/70">
          <span>Estimated Shipping</span>
          <span className={freeShip ? "text-accent font-medium" : ""}>
            {freeShip ? "FREE" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between text-ink/70">
          <span>Estimated Taxes</span>
          <span>${taxes.toFixed(2)}</span>
        </div>
      </div>

      <div className="flex justify-between items-baseline pt-4 border-t border-ink/10">
        <span className="font-medium text-ink">Final Total</span>
        <span className="font-display text-3xl text-ink">
          ${grandTotal.toFixed(2)}
        </span>
      </div>

      <Link
        to="/checkout"
        state={{ coupon: appliedCoupon }}
        className="block text-center bg-ink text-white py-4 text-xs tracking-widest uppercase hover:bg-ink/80 transition-colors"
      >
        🔒 Proceed to Secure Checkout
      </Link>

      <p className="text-[10px] text-center text-ink/40">
        🛡 256-Bit Encrypted &nbsp;•&nbsp; 🎧 24/7 Concierge
        <br />
        Complimentary white-glove returns within 30 days.
      </p>
    </div>
  );
}
