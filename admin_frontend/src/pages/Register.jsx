import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { adminRegister } from "../api/authApi";

const ROLES = ["Super Admin", "Admin", "Manager", "Staff"];

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    adminRole: "Staff",
    secretCode: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMsg("");
    setBusy(true);
    try {
      const res = await adminRegister(form);
      setMsg(res.message);
      setTimeout(() => navigate("/login"), 1500);
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
            Create Admin Account
          </h1>
          <p className="text-sm text-ink/50 mt-1 max-w-xs">
            Join the AURA management console with a secure invite code
          </p>
        </div>

        {error && (
          <p className="text-sm bg-red-50 text-danger border border-red-200 rounded-lg px-3 py-2 mb-5">
            {error}
          </p>
        )}
        {msg && (
          <p className="text-sm bg-green-50 text-green-700 border border-green-200 rounded-lg px-3 py-2 mb-5">
            {msg}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-medium text-ink">Full Name</label>
            <div className="mt-1.5 flex items-center gap-2 bg-cream/50 border border-ink/10 rounded-lg px-3 py-2.5 focus-within:ring-2 focus-within:ring-accent/40 focus-within:border-accent">
              <span className="text-ink/40">👤</span>
              <input
                required
                placeholder="Rahul Sharma"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="bg-transparent flex-1 outline-none text-sm text-ink placeholder:text-ink/30"
              />
            </div>
          </div>

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
            <label className="text-sm font-medium text-ink">Password</label>
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-ink">Role</label>
              <select
                value={form.adminRole}
                onChange={(e) =>
                  setForm({ ...form, adminRole: e.target.value })
                }
                className="mt-1.5 w-full bg-cream/50 border border-ink/10 rounded-lg px-3 py-2.5 text-sm text-ink outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent"
              >
                {ROLES.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-ink">
                Invite Code
              </label>
              <input
                required
                placeholder="Secret code"
                value={form.secretCode}
                onChange={(e) =>
                  setForm({ ...form, secretCode: e.target.value })
                }
                className="mt-1.5 w-full bg-cream/50 border border-ink/10 rounded-lg px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink/30 focus:ring-2 focus:ring-accent/40 focus:border-accent"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-ink text-white py-3 rounded-lg text-sm font-medium hover:bg-ink/85 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {busy ? (
              "Creating account…"
            ) : (
              <>
                Create Account <span>→</span>
              </>
            )}
          </button>
        </form>

        <p className="text-sm text-ink/60 text-center mt-8">
          Already have an account?{" "}
          <Link to="/login" className="text-accent font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </div>

      <p className="text-xs text-ink/30 mt-8 text-center px-4">
        © 2026 AURA Commerce Inc. Secure Enterprise Environment.
      </p>
    </div>
  );
}
