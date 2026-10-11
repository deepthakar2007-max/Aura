import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

import { useAuth } from "../hooks/useAuth";
import AuthShell from "../auth/AuthShell";
import AuthField from "../auth/AuthField";
import AuthAlert from "../auth/AuthAlert";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const LEVELS = ["Too short", "Weak", "Fair", "Good", "Strong"];

const COLORS = [
  "bg-ink/10",
  "bg-red-400",
  "bg-amber-400",
  "bg-lime-500",
  "bg-green-600",
];

function strength(password) {
  if (password.length < 6) return 0;

  let score = 1;

  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  return Math.min(score, 4);
}

export default function Register() {
  const { register, login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  const level = strength(form.password);

  const setField = (name) => (e) => {
    setForm((prev) => ({
      ...prev,
      [name]: e.target.value,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
      form: undefined,
    }));
  };

  const validate = () => {
    const found = {};

    if (form.username.trim().length < 2) {
      found.username = "Please enter your full name";
    }

    if (!form.email.trim()) {
      found.email = "Please enter your email";
    } else if (!EMAIL_RE.test(form.email.trim())) {
      found.email = "Please enter a valid email address";
    }

    if (!form.password) {
      found.password = "Please create a password";
    } else if (form.password.length < 6) {
      found.password = "Password must be at least 6 characters";
    }

    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (busy) return;

    const found = validate();

    if (Object.keys(found).length > 0) {
      setErrors(found);
      return;
    }

    setBusy(true);
    setErrors({});

    const payload = {
      username: form.username.trim(),
      email: form.email.trim(),
      password: form.password,
    };

    try {
      // 1. Create account directly. No OTP step.
      await register(payload);

      // 2. Automatically log in after successful registration.
      await login({
        email: payload.email,
        password: payload.password,
      });

      // 3. Open the home page.
      navigate("/", { replace: true });
    } catch (err) {
      const message = err?.message || "Something went wrong. Please try again.";

      if (["username", "email", "password"].includes(err?.field)) {
        setErrors({ [err.field]: message });
      } else {
        setErrors({ form: message });
      }

      // If account creation succeeded but login failed,
      // send the user to login instead of any OTP page.
      if (err?.registrationSucceeded) {
        navigate("/login", {
          replace: true,
          state: {
            notice: "Account created! Please sign in.",
            email: payload.email,
          },
        });
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Create account"
      subtitle="It only takes a minute."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="text-brandDark font-medium underline">
            Sign in
          </Link>
        </>
      }
    >
      {errors.form && <AuthAlert>{errors.form}</AuthAlert>}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <AuthField
          label="Full name"
          name="username"
          icon={User}
          autoComplete="name"
          placeholder="Your name"
          value={form.username}
          onChange={setField("username")}
          error={errors.username}
        />

        <AuthField
          label="Email"
          name="email"
          type="email"
          icon={Mail}
          autoComplete="email"
          placeholder="you@example.com"
          value={form.email}
          onChange={setField("email")}
          error={errors.email}
        />

        <div>
          <AuthField
            label="Password"
            name="password"
            icon={Lock}
            autoComplete="new-password"
            type={showPw ? "text" : "password"}
            placeholder="At least 6 characters"
            value={form.password}
            onChange={setField("password")}
            error={errors.password}
            right={
              <button
                type="button"
                onClick={() => setShowPw((prev) => !prev)}
                aria-label={showPw ? "Hide password" : "Show password"}
                className="text-ink/40 hover:text-ink"
              >
                {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
          />

          {form.password && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i <= level ? COLORS[level] : "bg-ink/10"
                    }`}
                  />
                ))}
              </div>

              <p className="text-xs text-ink/50 mt-1">
                Password strength: {LEVELS[level]}
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-brandDark text-paper py-3 rounded-lg text-sm font-medium hover:bg-brand transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {busy && <Loader2 size={16} className="animate-spin" />}
          {busy ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthShell>
  );
}
