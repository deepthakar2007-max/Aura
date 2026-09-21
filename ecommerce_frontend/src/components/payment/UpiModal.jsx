import { useState } from "react";

const apps = [
  { name: "Google Pay", emoji: "🟢" },
  { name: "PhonePe", emoji: "🟣" },
  { name: "Paytm", emoji: "🔵" },
];

export default function UpiModal({ amount, onSuccess, onClose }) {
  const [step, setStep] = useState("select"); // select -> id -> processing
  const [selectedApp, setSelectedApp] = useState(null);
  const [upiId, setUpiId] = useState("");

  const handleAppSelect = (app) => {
    setSelectedApp(app);
    setStep("id");
  };

  const handlePay = (e) => {
    e.preventDefault();
    setStep("processing");
    setTimeout(() => {
      onSuccess();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative">
        {step !== "processing" && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-ink/40 hover:text-ink"
          >
            ✕
          </button>
        )}

        {step === "select" && (
          <>
            <h3 className="font-display text-xl text-brandDark mb-1">
              Pay via UPI
            </h3>
            <p className="text-sm text-ink/50 mb-5">
              Amount: ₹{amount.toFixed(0)}
            </p>
            <div className="space-y-2">
              {apps.map((app) => (
                <button
                  key={app.name}
                  onClick={() => handleAppSelect(app)}
                  className="w-full flex items-center gap-3 border border-ink/10 rounded-xl p-3 hover:border-brand/40 transition-colors"
                >
                  <span className="text-xl">{app.emoji}</span>
                  <span className="text-sm font-medium text-ink">
                    {app.name}
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === "id" && (
          <form onSubmit={handlePay}>
            <h3 className="font-display text-xl text-brandDark mb-1">
              {selectedApp.name}
            </h3>
            <p className="text-sm text-ink/50 mb-5">
              Enter your UPI ID to continue
            </p>
            <input
              type="text"
              required
              placeholder="yourname@upi"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full rounded-lg border border-ink/15 px-3 py-2.5 mb-4 focus:outline-none focus:ring-2 focus:ring-brand"
            />
            <button
              type="submit"
              className="w-full bg-brandDark text-paper py-3 rounded-lg hover:bg-brand transition-colors"
            >
              Pay ₹{amount.toFixed(0)}
            </button>
          </form>
        )}

        {step === "processing" && (
          <div className="py-8 flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-brand/20 border-t-brand rounded-full animate-spin" />
            <p className="text-sm text-ink/60">
              Processing payment via {selectedApp.name}…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
