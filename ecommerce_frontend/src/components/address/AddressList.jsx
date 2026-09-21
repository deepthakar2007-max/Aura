export default function AddressList({
  addresses,
  selectedId,
  onSelect,
  onDelete,
  onEdit,
}) {
  if (!addresses.length) {
    return <p className="text-ink/50 text-sm">No saved addresses yet.</p>;
  }

  return (
    <div className="space-y-3">
      {addresses.map((addr) => (
        <label
          key={addr._id}
          className={`block border rounded-xl p-4 cursor-pointer transition-colors ${
            selectedId === addr._id
              ? "border-brand bg-brand/5"
              : "border-ink/10 hover:border-ink/20"
          }`}
        >
          <div className="flex justify-between">
            <div className="flex gap-3">
              {onSelect && (
                <input
                  type="radio"
                  checked={selectedId === addr._id}
                  onChange={() => onSelect(addr._id)}
                  className="mt-1 accent-brand"
                />
              )}
              <div>
                <p className="font-medium text-ink flex items-center gap-2">
                  {addr.fullname}
                  <span className="text-xs font-normal text-accent border border-accent/30 rounded-full px-2 py-0.5">
                    {addr.addresstype}
                  </span>
                </p>
                <p className="text-sm text-ink/60 mt-1">
                  {addr.address}, {addr.city}, {addr.state} - {addr.pincode}
                </p>
                {addr.landmark && (
                  <p className="text-sm text-ink/40">
                    Landmark: {addr.landmark}
                  </p>
                )}
                <p className="text-sm text-ink/60 mt-1">
                  Mobile: {addr.mobile}
                </p>
              </div>
            </div>
            <div className="flex gap-3 h-fit text-sm">
              {onEdit && (
                <button
                  onClick={() => onEdit(addr)}
                  className="text-ink/40 hover:text-brandDark transition-colors"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(addr._id)}
                  className="text-ink/40 hover:text-red-500 transition-colors"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        </label>
      ))}
    </div>
  );
}
