import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function Login() {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
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
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-ink/10 p-8 w-full max-w-sm space-y-5"
      >
        <h1 className="text-2xl font-semibold text-ink">Admin Login</h1>
        {error && (
          <p className="text-sm bg-red-50 text-danger border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}
        <div>
          <label className="text-sm text-ink/70">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="mt-1 w-full border border-ink/15 px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Password</label>
          <input
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="mt-1 w-full border border-ink/15 px-3 py-2 rounded"
          />
        </div>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-accent underline">
            Forgot password?
          </Link>
        </div>
        <button
          type="submit"
          disabled={busy}
          className="w-full bg-ink text-white py-2.5 rounded hover:bg-ink/80 disabled:opacity-60"
        >
          {busy ? "Signing in…" : "Sign in"}
        </button>
        <p className="text-sm text-ink/60 text-center">
          Need an admin account?{" "}
          <Link to="/register" className="text-accent underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
