import { AlertCircle } from "lucide-react";

export default function AuthField({
  label,
  labelRight,
  error,
  icon: Icon,
  right,
  id,
  ...inputProps
}) {
  const fieldId = id || inputProps.name;

  return (
    <div>
      <div className="flex items-center justify-between">
        <label htmlFor={fieldId} className="text-sm text-ink/70">
          {label}
        </label>
        {labelRight}
      </div>
      <div
        className={`mt-1.5 flex items-center gap-2 rounded-lg border bg-white px-3 transition focus-within:ring-2 ${
          error
            ? "border-red-400 focus-within:ring-red-200"
            : "border-ink/15 focus-within:border-accent focus-within:ring-accent/30"
        }`}
      >
        {Icon && <Icon size={16} className="flex-shrink-0 text-ink/40" />}
        <input
          id={fieldId}
          aria-invalid={Boolean(error)}
          {...inputProps}
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm outline-none placeholder:text-ink/30"
        />
        {right}
      </div>
      {error && (
        <p
          role="alert"
          className="mt-1.5 flex items-start gap-1.5 text-xs text-red-600"
        >
          <AlertCircle size={13} className="mt-0.5 flex-shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
