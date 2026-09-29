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
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      {step === 1 ? (
        <form
          onSubmit={handleSendOtp}
          className="bg-white border border-ink/10 p-8 w-full max-w-sm space-y-4"
        >
          <h1 className="text-2xl font-semibold text-ink">Forgot Password</h1>
          {error && (
            <p className="text-sm bg-red-50 text-danger border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}
          <input
            type="email"
            placeholder="Admin Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full border border-ink/15 px-3 py-2 rounded"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-ink text-white py-2.5 rounded disabled:opacity-60"
          >
            {busy ? "Sending…" : "Send OTP"}
          </button>
          <p className="text-sm text-center">
            <Link to="/login" className="text-accent underline">
              Back to login
            </Link>
          </p>
        </form>
      ) : (
        <form
          onSubmit={handleReset}
          className="bg-white border border-ink/10 p-8 w-full max-w-sm space-y-4"
        >
          <h1 className="text-2xl font-semibold text-ink">Reset Password</h1>
          {error && (
            <p className="text-sm bg-red-50 text-danger border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}
          <input
            placeholder="Enter OTP"
            required
            maxLength={6}
            value={form.otp}
            onChange={(e) => setForm({ ...form, otp: e.target.value })}
            className="w-full border border-ink/15 px-3 py-2 rounded text-center tracking-widest"
          />
          <input
            type="password"
            placeholder="New Password"
            required
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            className="w-full border border-ink/15 px-3 py-2 rounded"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full bg-ink text-white py-2.5 rounded disabled:opacity-60"
          >
            {busy ? "Resetting…" : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  );
}
