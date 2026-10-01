import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { getOrders } from "../api/orderApi";

const PER_PAGE = 5;

const statusBadge = {
  Pending: "bg-amber-100 text-amber-700",
  Processing: "bg-blue-100 text-blue-700",
  Shipped: "bg-indigo-100 text-indigo-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-danger",
};

function toCSV(orders) {
  const headers = ["Order ID", "Customer", "Email", "Amount", "Status", "Date"];
  const rows = orders.map((o) => [
    o._id,
    o.user?.username || "",
    o.user?.email || "",
    o.totalPrice,
    o.orderstatus,
    new Date(o.createdAt).toLocaleDateString("en-IN"),
  ]);
  return [headers, ...rows]
    .map((r) => r.map((v) => `"${v}"`).join(","))
    .join("\n");
}

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? orders.filter((o) => o.orderstatus === filter)
    : orders;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalRevenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const today = new Date().toDateString();
  const ordersToday = orders.filter(
    (o) => new Date(o.createdAt).toDateString() === today,
  ).length;

  const handleExport = () => {
    const blob = new Blob([toCSV(filtered)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "orders.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const initials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "?";

  return (
    <AdminLayout>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <h1 className="text-xl font-semibold text-ink">Orders</h1>
        <div className="flex gap-4">
          <div className="text-right">
            <p className="text-xs text-ink/40">Total Revenue</p>
            <p className="text-sm font-semibold text-ink">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-ink/40">Orders Today</p>
            <p className="text-sm font-semibold text-ink">{ordersToday}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-5">
        <select
          value={filter}
          onChange={(e) => {
            setFilter(e.target.value);
            setPage(1);
          }}
          className="bg-cream/60 border border-ink/10 rounded-lg px-3 py-2 text-sm"
        >
          <option value="">All Statuses</option>
          {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
            (s) => (
              <option key={s}>{s}</option>
            ),
          )}
        </select>
        <button
          onClick={handleExport}
          className="border border-ink/10 rounded-lg px-4 py-2 text-sm text-ink hover:bg-cream/40 transition-colors"
        >
          ↓ Export CSV
        </button>
      </div>

      <div className="bg-white border border-ink/10 rounded-xl overflow-hidden">
        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !paginated.length ? (
          <p className="p-6 text-ink/50">No orders found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="text-left text-ink/40 border-b border-ink/10 bg-cream/40 uppercase text-xs">
                    <th className="py-3 px-4">Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th className="pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((o) => (
                    <tr
                      key={o._id}
                      className="border-b border-ink/5 hover:bg-cream/30"
                    >
                      <td className="py-3 px-4 font-medium text-accent">
                        #{o._id.slice(-6).toUpperCase()}
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-full bg-accent/15 text-accent text-xs flex items-center justify-center flex-shrink-0">
                            {initials(o.user?.username)}
                          </span>
                          <div className="min-w-0">
                            <p className="text-ink truncate">
                              {o.user?.username || "Unknown"}
                            </p>
                            <p className="text-xs text-ink/40 truncate">
                              {o.user?.email || "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="font-medium">₹{o.totalPrice}</td>
                      <td>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusBadge[o.orderstatus] || "bg-gray-100 text-ink/60"}`}
                        >
                          {o.orderstatus}
                        </span>
                      </td>
                      <td className="text-ink/60">
                        {new Date(o.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="pr-4">
                        <Link
                          to={`/orders/${o._id}`}
                          className="border border-ink/10 rounded-lg px-3 py-1.5 text-xs text-ink hover:bg-cream/40"
                        >
                          👁 View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-ink/10">
              <p className="text-sm text-ink/50">
                Showing{" "}
                <strong className="text-ink">
                  {(page - 1) * PER_PAGE + 1}
                </strong>{" "}
                to{" "}
                <strong className="text-ink">
                  {Math.min(page * PER_PAGE, filtered.length)}
                </strong>{" "}
                of <strong className="text-ink">{filtered.length}</strong>{" "}
                results
              </p>
              <div className="flex gap-1.5 flex-wrap justify-center">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-ink/10 text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(0, 5)
                  .map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-9 h-9 rounded-lg text-sm ${page === n ? "bg-ink text-white" : "border border-ink/10 text-ink/60"}`}
                    >
                      {n}
                    </button>
                  ))}
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg border border-ink/10 text-sm disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
