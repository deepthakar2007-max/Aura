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
    <div className="min-h-screen flex items-center justify-center bg-paper px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-ink/10 p-8 w-full max-w-sm space-y-4"
      >
        <h1 className="text-2xl font-semibold text-ink">
          Create Admin Account
        </h1>
        {error && (
          <p className="text-sm bg-red-50 text-danger border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}
        {msg && (
          <p className="text-sm bg-green-50 text-green-700 border border-green-200 rounded px-3 py-2">
            {msg}
          </p>
        )}

        <input
          placeholder="Username"
          required
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className="w-full border border-ink/15 px-3 py-2 rounded"
        />
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full border border-ink/15 px-3 py-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="w-full border border-ink/15 px-3 py-2 rounded"
        />

        <select
          value={form.adminRole}
          onChange={(e) => setForm({ ...form, adminRole: e.target.value })}
          className="w-full border border-ink/15 px-3 py-2 rounded"
        >
          {ROLES.map((r) => (
            <option key={r}>{r}</option>
          ))}
        </select>

        <input
          placeholder="Admin Secret Code"
          required
          value={form.secretCode}
          onChange={(e) => setForm({ ...form, secretCode: e.target.value })}
          className="w-full border border-ink/15 px-3 py-2 rounded"
        />
        <p className="text-xs text-ink/40">
          Secret code is set by the business owner in the backend .env file.
        </p>

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-ink text-white py-2.5 rounded disabled:opacity-60"
        >
          {busy ? "Creating…" : "Create Account"}
        </button>

        <p className="text-sm text-ink/60 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-accent underline">
            Sign in
          </Link>
        </p>
      </form>
    </div>
  );
}
