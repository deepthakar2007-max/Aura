const steps = ["Cart", "Address", "Delivery", "Payment", "Review"];

export default function CheckoutSteps({ current }) {
  return (
    <div className="bg-cream/60 rounded-xl p-4 flex items-center justify-center gap-3 flex-wrap mb-10">
      {steps.map((label, i) => {
        const num = i + 1;
        const active = num === current;
        const done = num < current;
        return (
          <div key={label} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${
                  active
                    ? "bg-accent text-ink"
                    : done
                      ? "bg-ink text-white"
                      : "bg-ink/10 text-ink/40"
                }`}
              >
                {num}
              </span>
              <span
                className={`text-sm ${active ? "text-ink font-medium" : "text-ink/40"}`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && <span className="w-8 h-px bg-ink/15" />}
          </div>
        );
      })}
    </div>
  );
}
