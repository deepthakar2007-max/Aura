export default function DeliveryOptions({ tier, onChange }) {
  const options = [
    {
      id: "express",
      label: "Express White-Glove Delivery",
      desc: "Hand-delivered by courier, unpacked & inspected",
      price: 150,
    },
    {
      id: "standard",
      label: "Standard Secure Courier",
      desc: "Fully insured delivery within 3–5 business days",
      price: 0,
    },
  ];

  return (
    <div className="bg-white border border-ink/10 p-6">
      <div className="flex items-center gap-3 mb-5">
        <span className="w-9 h-9 bg-ink text-white rounded-lg flex items-center justify-center">
          🚚
        </span>
        <div>
          <p className="font-medium text-ink">Delivery Options</p>
          <p className="text-xs text-ink/50">
            Select your preferred shipping tier
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {options.map((opt) => (
          <label
            key={opt.id}
            className={`flex items-center justify-between p-4 border cursor-pointer transition-colors ${
              tier === opt.id ? "border-ink bg-cream/50" : "border-ink/10"
            }`}
          >
            <div className="flex items-center gap-3">
              <input
                type="radio"
                checked={tier === opt.id}
                onChange={() => onChange(opt.id)}
                className="accent-ink"
              />
              <div>
                <p className="text-sm font-medium text-ink">{opt.label}</p>
                <p className="text-xs text-ink/50">{opt.desc}</p>
              </div>
            </div>
            <span className="text-sm font-medium text-ink">
              {opt.price === 0 ? "Complimentary" : `$${opt.price.toFixed(2)}`}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
}
