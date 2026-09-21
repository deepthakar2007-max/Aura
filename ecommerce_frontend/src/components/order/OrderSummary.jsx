const statusStyles = {
  Pending: "bg-amber-50 text-amber-700 border-amber-200",
  Processing: "bg-blue-50 text-blue-700 border-blue-200",
  Shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Delivered: "bg-green-50 text-green-700 border-green-200",
  Cancelled: "bg-red-50 text-red-700 border-red-200",
};

export default function OrderSummary({ order }) {
  const badge =
    statusStyles[order.orderstatus] || "bg-ink/5 text-ink/60 border-ink/10";

  return (
    <div className="flex items-center justify-between border-b border-ink/10 pb-4">
      <div>
        <p className="text-sm text-ink/50">
          Order #{order._id.slice(-8).toUpperCase()}
        </p>
        <p className="text-xs text-ink/40 mt-0.5">
          Placed on{" "}
          {new Date(order.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
      </div>
      <span
        className={`text-xs font-medium border rounded-full px-3 py-1 ${badge}`}
      >
        {order.orderstatus}
      </span>
    </div>
  );
}
