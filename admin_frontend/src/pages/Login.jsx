import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function Login() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login(form);
      navigate("/dashboard");
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
          <h1 className="text-xl font-semibold text-ink">AURA Admin</h1>
          <p className="text-sm text-ink/50 mt-1 max-w-xs">
            Sign in to your high-end store management console
          </p>
        </div>

        {error && (
          <p className="text-sm bg-red-50 text-danger border border-red-200 rounded-lg px-3 py-2 mb-5">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
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

          <div>
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-ink">Password</label>
              <Link
                to="/forgot-password"
                className="text-xs text-accent hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="mt-1.5 flex items-center gap-2 bg-cream/50 border border-ink/10 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-accent/40 focus-within:border-accent">
              <span className="text-ink/40">🔒</span>
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="••••••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="bg-transparent flex-1 outline-none text-sm text-ink placeholder:text-ink/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="text-ink/40 text-sm"
              >
                {showPassword ? "🙈" : "👁"}
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm text-ink/70 cursor-pointer">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="accent-ink w-4 h-4 rounded"
            />
            Remember this device for 30 days
          </label>

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-ink text-white py-3 rounded-lg text-sm font-medium hover:bg-ink/85 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {busy ? (
              "Signing in…"
            ) : (
              <>
                Sign In <span>→</span>
              </>
            )}
          </button>
        </form>

        <p className="text-sm text-ink/60 text-center mt-8">
          New administrator?{" "}
          <Link
            to="/register"
            className="text-accent font-medium hover:underline"
          >
            Create admin account
          </Link>
        </p>
      </div>

      <p className="text-xs text-ink/30 mt-8 text-center px-4">
        © 2026 AURA Commerce Inc. Secure Enterprise Environment.
      </p>
    </div>
  );
}
