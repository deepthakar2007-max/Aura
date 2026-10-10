import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import AuthShell from "../components/auth/AuthShell";
import AuthField from "../components/auth/AuthField";
import AuthAlert from "../components/auth/AuthAlert";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { state } = useLocation();
  const [form, setForm] = useState({ email: state?.email || "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  const setField = (name) => (e) => {
    setForm((f) => ({ ...f, [name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [name]: undefined, form: undefined }));
  };

  const validate = () => {
    const found = {};
    if (!form.email.trim()) found.email = "Please enter your email";
    else if (!EMAIL_RE.test(form.email.trim()))
      found.email = "Please enter a valid email address";
    if (!form.password) found.password = "Please enter your password";
    return found;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const found = validate();
    if (Object.keys(found).length) return setErrors(found);

    setBusy(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate("/", { replace: true });
    } catch (err) {
      if (err.field === "email" || err.field === "password")
        setErrors({ [err.field]: err.message });
      else setErrors({ form: err.message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue shopping."
      footer={
        <>
          New to AURA?{" "}
          <Link to="/register" className="text-brandDark font-medium underline">
            Create an account
          </Link>
        </>
      }
    >
      {state?.notice && <AuthAlert type="success">{state.notice}</AuthAlert>}
      {errors.form && <AuthAlert>{errors.form}</AuthAlert>}

      <form onSubmit={handleSubmit} noValidate className="space-y-5">
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

        <AuthField
          label="Password"
          name="password"
          icon={Lock}
          autoComplete="current-password"
          type={showPw ? "text" : "password"}
          placeholder="Your password"
          value={form.password}
          onChange={setField("password")}
          error={errors.password}
          labelRight={
            <Link
              to="/forgot-password"
              className="text-xs text-brandDark underline"
            >
              Forgot password?
            </Link>
          }
          right={
            <button
              type="button"
              onClick={() => setShowPw((s) => !s)}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="text-ink/40 hover:text-ink"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        <button
          type="submit"
          disabled={busy}
          className="w-full bg-brandDark text-paper py-3 rounded-lg text-sm font-medium hover:bg-brand transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {busy && <Loader2 size={16} className="animate-spin" />}
          {busy ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </AuthShell>
  );
}
