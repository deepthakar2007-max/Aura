import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function AuthAlert({ type = "error", children }) {
  const isError = type === "error";
  const Icon = isError ? AlertCircle : CheckCircle2;

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`mb-5 flex items-start gap-2 rounded-lg border px-3 py-2.5 text-sm ${
        isError
          ? "bg-red-50 text-red-700 border-red-200"
          : "bg-green-50 text-green-700 border-green-200"
      }`}
    >
      <Icon size={16} className="mt-0.5 flex-shrink-0" />
      <span>{children}</span>
    </div>
  );
}
