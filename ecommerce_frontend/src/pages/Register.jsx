import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { sendOtp, verifyOtp } from "../api/authApi";
import AnimatedButton from "../components/animations/AnimatedButton";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    otp: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await sendOtp(form.email);
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleVerifyAndRegister = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await verifyOtp(form.email, form.otp);
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] grid md:grid-cols-2">
      <div className="hidden md:flex flex-col justify-between bg-brandDark text-paper p-12">
        <span className="font-display text-2xl">Fern & Field</span>
        <p className="font-display text-4xl leading-tight max-w-sm">
          Join a community that shops with intention.
        </p>
        <span className="text-paper/60 text-sm">Create your account.</span>
      </div>

      <div className="flex items-center justify-center p-8">
        {step === 1 ? (
          <form onSubmit={handleSendOtp} className="w-full max-w-sm space-y-5">
            <div>
              <h1 className="font-display text-3xl text-brandDark">
                Create account
              </h1>
              <p className="text-ink/60 text-sm mt-1">
                It only takes a minute.
              </p>
            </div>

            {error && (
              <p className="text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div>
              <label className="text-sm text-ink/70">Username</label>
              <input
                type="text"
                name="username"
                required
                value={form.username}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <div>
              <label className="text-sm text-ink/70">Email</label>
              <input
                type="email"
                name="email"
                required
                value={form.email}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <div>
              <label className="text-sm text-ink/70">Password</label>
              <input
                type="password"
                name="password"
                required
                value={form.password}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <AnimatedButton
              type="submit"
              disabled={busy}
              className="w-full bg-brandDark text-paper py-2.5 rounded-lg hover:bg-brand transition-colors disabled:opacity-60"
            >
              {busy ? "Sending OTP…" : "Send OTP"}
            </AnimatedButton>

            <p className="text-sm text-ink/60">
              Already have an account?{" "}
              <Link to="/login" className="text-brandDark underline">
                Sign in
              </Link>
            </p>
          </form>
        ) : (
          <form
            onSubmit={handleVerifyAndRegister}
            className="w-full max-w-sm space-y-5"
          >
            <div>
              <h1 className="font-display text-3xl text-brandDark">
                Verify your email
              </h1>
              <p className="text-ink/60 text-sm mt-1">
                We sent a code to {form.email}
              </p>
            </div>

            {error && (
              <p className="text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg px-3 py-2">
                {error}
              </p>
            )}

            <div>
              <label className="text-sm text-ink/70">Enter OTP</label>
              <input
                type="text"
                name="otp"
                required
                maxLength={6}
                value={form.otp}
                onChange={handleChange}
                className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 tracking-widest text-center text-lg focus:outline-none focus:ring-2 focus:ring-brand"
              />
            </div>

            <AnimatedButton
              type="submit"
              disabled={busy}
              className="w-full bg-brandDark text-paper py-2.5 rounded-lg hover:bg-brand transition-colors disabled:opacity-60"
            >
              {busy ? "Verifying…" : "Verify & Create Account"}
            </AnimatedButton>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-sm text-ink/60 underline"
            >
              ← Change details
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
