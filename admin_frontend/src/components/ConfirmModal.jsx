export default function ConfirmModal({ message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-sm">
        <p className="text-sm text-ink mb-5">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 bg-danger text-white py-2 rounded text-sm"
          >
            Confirm
          </button>
          <button
            onClick={onCancel}
            className="flex-1 border border-ink/15 py-2 rounded text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
