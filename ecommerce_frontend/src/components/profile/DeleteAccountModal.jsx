import { useState } from "react";
import { deleteAccount } from "../../api/authApi";

export default function DeleteAccountModal({ onClose, onDeleted }) {
  const [confirmText, setConfirmText] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setError("");
    setBusy(true);
    try {
      await deleteAccount();
      onDeleted();
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-ink/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6">
        <h3 className="font-display text-xl text-red-600">Delete account</h3>
        <p className="text-sm text-ink/60 mt-2">
          This will permanently delete your account and cannot be undone. Type{" "}
          <strong>DELETE</strong> to confirm.
        </p>

        {error && <p className="text-sm text-red-500 mt-3">{error}</p>}

        <input
          type="text"
          value={confirmText}
          onChange={(e) => setConfirmText(e.target.value)}
          placeholder="Type DELETE"
          className="mt-4 w-full rounded-lg border border-ink/15 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-400"
        />

        <div className="flex gap-3 mt-5">
          <button
            onClick={handleDelete}
            disabled={confirmText !== "DELETE" || busy}
            className="flex-1 bg-red-600 text-white py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-40"
          >
            {busy ? "Deleting…" : "Delete my account"}
          </button>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg border border-ink/15 hover:border-ink/30 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
