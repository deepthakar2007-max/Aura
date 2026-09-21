import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAuth } from "../hooks/useAuth";
import AnimatedButton from "../components/animations/AnimatedButton";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
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
      <motion.div
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
        className="hidden md:flex flex-col justify-between bg-brandDark text-paper p-12"
      >
        <span className="font-display text-2xl">Fern & Field</span>
        <p className="font-display text-4xl leading-tight max-w-sm">
          Join a community that shops with intention.
        </p>
        <span className="text-paper/60 text-sm">Create your account.</span>
      </motion.div>

      <div className="flex items-center justify-center p-8">
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          onSubmit={handleSubmit}
          className="w-full max-w-sm space-y-5"
        >
          <div>
            <h1 className="font-display text-3xl text-brandDark">
              Create account
            </h1>
            <p className="text-ink/60 text-sm mt-1">It only takes a minute.</p>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm bg-red-50 text-red-700 border border-red-200 rounded-lg px-3 py-2"
            >
              {error}
            </motion.p>
          )}

          <div>
            <label className="text-sm text-ink/70">Username</label>
            <input
              type="text"
              name="username"
              required
              value={form.username}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand transition-shadow"
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
              className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand transition-shadow"
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
              className="mt-1 w-full rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand transition-shadow"
            />
          </div>

          <AnimatedButton
            type="submit"
            disabled={busy}
            className="w-full bg-brandDark text-paper py-2.5 rounded-lg hover:bg-brand transition-colors disabled:opacity-60"
          >
            {busy ? "Creating account…" : "Create account"}
          </AnimatedButton>

          <p className="text-sm text-ink/60">
            Already have an account?{" "}
            <Link to="/login" className="text-brandDark underline">
              Sign in
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
}
