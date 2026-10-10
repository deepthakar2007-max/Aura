import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { forgotPassword, resetPassword } from "../api/authApi";
import AuthShell from "../components/auth/AuthShell";
import AuthField from "../components/auth/AuthField";
import AuthAlert from "../components/auth/AuthAlert";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState({});
  const [info, setInfo] = useState("");
  const [busy, setBusy] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const sendCode = async (e) => {
    if (e) e.preventDefault();
    if (!email.trim()) return setErrors({ email: "Please enter your email" });
    if (!EMAIL_RE.test(email.trim()))
      return setErrors({ email: "Please enter a valid email address" });

    setBusy(true);
    setErrors({});
    try {
      const res = await forgotPassword(email.trim());
      setInfo(res.message);
      setStep(2);
      setCooldown(60);
    } catch (err) {
      if (err.field === "email") setErrors({ email: err.message });
      else setErrors({ form: err.message });
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    const found = {};
    if (otp.length !== 6) found.otp = "Enter the 6-digit code from your email";
    if (newPassword.length < 6)
      found.newPassword = "Password must be at least 6 characters";
    if (Object.keys(found).length) return setErrors(found);

    setBusy(true);
    setErrors({});
    try {
      await resetPassword({ email: email.trim(), otp, newPassword });
      navigate("/login", {
        replace: true,
        state: {
          notice: "Password updated. Please sign in with your new password.",
          email: email.trim(),
        },
      });
    } catch (err) {
      if (["otp", "newPassword", "email"].includes(err.field))
        setErrors({ [err.field]: err.message });
      else setErrors({ form: err.message });
    } finally {
      setBusy(false);
    }
  };

  const submitClass =
    "w-full bg-brandDark text-paper py-3 rounded-lg text-sm font-medium hover:bg-brand transition-colors disabled:opacity-60 flex items-center justify-center gap-2";

  return (
    <AuthShell
      title={step === 1 ? "Forgot password?" : "Reset password"}
      subtitle={
        step === 1
          ? "Enter your email and we'll send you a 6-digit code."
          : info
      }
      footer={
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 text-brandDark font-medium"
        >
          <ArrowLeft size={14} /> Back to sign in
        </Link>
      }
    >
      {errors.form && <AuthAlert>{errors.form}</AuthAlert>}

      {step === 1 ? (
        <form onSubmit={sendCode} noValidate className="space-y-5">
          <AuthField
            label="Email"
            name="email"
            type="email"
            icon={Mail}
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors({});
            }}
            error={errors.email}
          />
          <button type="submit" disabled={busy} className={submitClass}>
            {busy && <Loader2 size={16} className="animate-spin" />}
            {busy ? "Sending code…" : "Send code"}
          </button>
        </form>
      ) : (
        <form onSubmit={handleReset} noValidate className="space-y-5">
          <AuthField
            label="6-digit code"
            name="otp"
            icon={KeyRound}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder="••••••"
            value={otp}
            onChange={(e) => {
              setOtp(e.target.value.replace(/\D/g, ""));
              setErrors((p) => ({ ...p, otp: undefined, form: undefined }));
            }}
            error={errors.otp}
          />

          <AuthField
            label="New password"
            name="newPassword"
            icon={Lock}
            autoComplete="new-password"
            type={showPw ? "text" : "password"}
            placeholder="At least 6 characters"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrors((p) => ({
                ...p,
                newPassword: undefined,
                form: undefined,
              }));
            }}
            error={errors.newPassword}
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

          <button type="submit" disabled={busy} className={submitClass}>
            {busy && <Loader2 size={16} className="animate-spin" />}
            {busy ? "Updating…" : "Update password"}
          </button>

          <p className="text-sm text-ink/60 text-center">
            Didn't get it?{" "}
            {cooldown > 0 ? (
              <span>Resend in {cooldown}s</span>
            ) : (
              <button
                type="button"
                onClick={sendCode}
                disabled={busy}
                className="text-brandDark font-medium underline"
              >
                Resend code
              </button>
            )}
          </p>
        </form>
      )}
    </AuthShell>
  );
}
