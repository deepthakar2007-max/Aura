import { useState } from "react";
import { validateCoupon } from "../../api/couponApi";

export default function CouponBox({ orderTotal, onApply, appliedCoupon }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await validateCoupon(code);
      const coupon = res.data[0];

      if (!coupon) {
        setError("Invalid coupon code");
        return;
      }
      if (coupon.status !== "Active") {
        setError("This coupon is no longer active");
        return;
      }
      if (new Date(coupon.expiryDate) < new Date()) {
        setError("This coupon has expired");
        return;
      }
      if (orderTotal < coupon.minimumOrderAmount) {
        setError(
          `Add ₹${(coupon.minimumOrderAmount - orderTotal).toFixed(0)} more to use this code`,
        );
        return;
      }

      onApply(coupon);
      setCode("");
      setExpanded(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (appliedCoupon) {
    const savings =
      appliedCoupon.discountType === "PERCENTAGE"
        ? (orderTotal * appliedCoupon.discount) / 100
        : appliedCoupon.discount;

    return (
      <div className="flex items-center justify-between gap-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm">
            %
          </div>
          <div>
            <p className="text-sm font-medium text-green-800">
              {appliedCoupon.code} applied
            </p>
            <p className="text-xs text-green-600">
              You saved ₹{savings.toFixed(0)}
            </p>
          </div>
        </div>
        <button
          onClick={() => onApply(null)}
          className="text-xs text-green-700 border border-green-300 rounded-full px-3 py-1 hover:bg-green-100 transition-colors"
        >
          Remove
        </button>
      </div>
    );
  }

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full flex items-center justify-between border border-dashed border-accent/50 rounded-xl px-4 py-3 text-sm text-accent hover:bg-accent/5 transition-colors"
      >
        <span className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center text-xs">
            %
          </span>
          Have a coupon code?
        </span>
        <span className="text-xs">Apply →</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={handleApply}
      className="border border-ink/10 rounded-xl p-4 space-y-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink">Enter coupon code</p>
        <button
          type="button"
          onClick={() => {
            setExpanded(false);
            setError("");
          }}
          className="text-xs text-ink/40 hover:text-ink/70"
        >
          Cancel
        </button>
      </div>

      <input
        type="text"
        autoFocus
        placeholder="e.g. SAVE10"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        className="w-full rounded-lg border border-ink/15 px-3 py-2 text-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-brand"
      />

      <button
        type="submit"
        disabled={busy || !code}
        className="w-full py-2.5 rounded-lg bg-brandDark text-paper text-sm hover:bg-brand transition-colors disabled:opacity-50"
      >
        {busy ? "Checking…" : "Apply"}
      </button>

      {error && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </p>
      )}
    </form>
  );
}
