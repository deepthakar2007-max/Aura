export default function PaymentForm({ method, onChange }) {
  return (
    <div className="space-y-3">
      <label
        className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-colors ${
          method === "COD"
            ? "border-brand bg-brand/5"
            : "border-ink/10 hover:border-ink/20"
        }`}
      >
        <input
          type="radio"
          name="paymentMethod"
          checked={method === "COD"}
          onChange={() => onChange("COD")}
          className="accent-brand"
        />
        <div>
          <p className="font-medium text-ink">Cash on Delivery</p>
          <p className="text-sm text-ink/50">Pay when your order arrives</p>
        </div>
      </label>

      <label
        className={`flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-colors ${
          method === "UPI"
            ? "border-brand bg-brand/5"
            : "border-ink/10 hover:border-ink/20"
        }`}
      >
        <input
          type="radio"
          name="paymentMethod"
          checked={method === "UPI"}
          onChange={() => onChange("UPI")}
          className="accent-brand"
        />
        <div>
          <p className="font-medium text-ink">UPI</p>
          <p className="text-sm text-ink/50">
            Pay using Google Pay, PhonePe, Paytm & more
          </p>
        </div>
      </label>
    </div>
  );
}
