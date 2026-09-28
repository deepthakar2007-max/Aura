import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { getOrders } from "../api/orderApi";

const statusColor = {
  Pending: "text-yellow-600",
  Processing: "text-blue-600",
  Shipped: "text-indigo-600",
  Delivered: "text-green-600",
  Cancelled: "text-danger",
};

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    getOrders()
      .then((res) => setOrders(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter
    ? orders.filter((o) => o.orderstatus === filter)
    : orders;

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold text-ink mb-5">Orders</h1>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border border-ink/15 rounded px-3 py-2 text-sm mb-4"
      >
        <option value="">All Status</option>
        {["Pending", "Processing", "Shipped", "Delivered", "Cancelled"].map(
          (s) => (
            <option key={s}>{s}</option>
          ),
        )}
      </select>

      <div className="bg-white border border-ink/10 rounded overflow-x-auto">
        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !filtered.length ? (
          <p className="p-6 text-ink/50">No orders.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/40 border-b border-ink/10">
                <th className="py-3 px-4">Order ID</th>
                <th>Customer</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o._id} className="border-b border-ink/5">
                  <td className="py-3 px-4">
                    #{o._id.slice(-6).toUpperCase()}
                  </td>
                  <td>{o.user?.username || "—"}</td>
                  <td>₹{o.totalPrice}</td>
                  <td className={statusColor[o.orderstatus]}>
                    {o.orderstatus}
                  </td>
                  <td>{new Date(o.createdAt).toLocaleDateString("en-IN")}</td>
                  <td>
                    <Link to={`/orders/${o._id}`} className="text-accent">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
