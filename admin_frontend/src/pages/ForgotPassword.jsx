import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { sendResetOtp, resetPassword } from "../api/authApi";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({ email: "", otp: "", newPassword: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await sendResetOtp(form.email);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await resetPassword(form);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-paper px-4 py-10">
      <div className="w-full max-w-md bg-white rounded-2xl border border-ink/10 p-6 sm:p-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-xl bg-ink flex items-center justify-center mb-4">
            <span className="text-accent text-2xl">◆</span>
          </div>
          <h1 className="text-xl font-semibold text-ink">
            {step === 1 ? "Forgot Password" : "Reset Password"}
          </h1>
          <p className="text-sm text-ink/50 mt-1 max-w-xs">
            {step === 1
              ? "We'll send a one-time code to your admin email"
              : `Code sent to ${form.email}`}
          </p>
        </div>

        {error && (
          <p className="text-sm bg-red-50 text-danger border border-red-200 rounded-lg px-3 py-2 mb-5">
            {error}
          </p>
        )}

        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-ink">
                Email Address
              </label>
              <div className="mt-1.5 flex items-center gap-2 bg-cream/50 border border-ink/10 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-accent/40 focus-within:border-accent">
                <span className="text-ink/40">✉</span>
                <input
                  type="email"
                  required
                  placeholder="admin@aurastore.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="bg-transparent flex-1 outline-none text-sm text-ink placeholder:text-ink/30"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-ink text-white py-3 rounded-lg text-sm font-medium hover:bg-ink/85 transition-colors disabled:opacity-60"
            >
              {busy ? "Sending…" : "Send OTP"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-ink">Enter OTP</label>
              <input
                required
                maxLength={6}
                placeholder="6-digit code"
                value={form.otp}
                onChange={(e) => setForm({ ...form, otp: e.target.value })}
                className="mt-1.5 w-full bg-cream/50 border border-ink/10 rounded-lg px-3 py-2.5 text-center tracking-[0.4em] text-lg outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-ink">
                New Password
              </label>
              <div className="mt-1.5 flex items-center gap-2 bg-cream/50 border border-ink/10 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-accent/40 focus-within:border-accent">
                <span className="text-ink/40">🔒</span>
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={form.newPassword}
                  onChange={(e) =>
                    setForm({ ...form, newPassword: e.target.value })
                  }
                  className="bg-transparent flex-1 outline-none text-sm text-ink placeholder:text-ink/30"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={busy}
              className="w-full bg-ink text-white py-3 rounded-lg text-sm font-medium hover:bg-ink/85 transition-colors disabled:opacity-60"
            >
              {busy ? "Resetting…" : "Reset Password"}
            </button>
          </form>
        )}

        <p className="text-sm text-ink/60 text-center mt-8">
          <Link to="/login" className="text-accent font-medium hover:underline">
            ← Back to login
          </Link>
        </p>
      </div>

      <p className="text-xs text-ink/30 mt-8 text-center px-4">
        © 2026 AURA Commerce Inc. Secure Enterprise Environment.
      </p>
    </div>
  );
}
