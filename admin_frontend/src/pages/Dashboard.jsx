import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { getDashboardStats } from "../api/dashboardApi";
import { getAnalytics } from "../api/analyticsApi";

const PER_PAGE = 5;

const statusColor = {
  Pending: "text-amber-600",
  Processing: "text-blue-600",
  Shipped: "text-indigo-600",
  Delivered: "text-green-600",
  Cancelled: "text-danger",
};

export default function Dashboard() {
  const [data, setData] = useState({
    products: [],
    orders: [],
    users: [],
    categories: [],
  });
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [orderFilter, setOrderFilter] = useState("");

  useEffect(() => {
    Promise.all([getDashboardStats(), getAnalytics()])
      .then(([dash, analyticsRes]) => {
        setData(dash);
        setAnalytics(analyticsRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <AdminLayout>
        <p className="text-ink/50">Loading dashboard…</p>
      </AdminLayout>
    );

  const { products, orders, users } = data;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const pendingOrders = orders.filter(
    (o) => o.orderstatus === "Pending",
  ).length;
  const totalRevenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const avgOrderValue = orders.length ? totalRevenue / orders.length : 0;

  const revenueDays = analytics
    ? Object.entries(analytics.revenueByDay).slice(-7)
    : [];
  const maxRevenue = Math.max(...revenueDays.map(([, v]) => v), 1);
  const todayLabel = new Date().toLocaleDateString("en-IN");
  const todayRevenue = analytics?.revenueByDay[todayLabel] || 0;

  const filteredOrders = orders.filter(
    (o) =>
      !orderFilter ||
      o.user?.username?.toLowerCase().includes(orderFilter.toLowerCase()) ||
      o._id.toLowerCase().includes(orderFilter.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PER_PAGE));
  const paginatedOrders = filteredOrders.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );

  const stats = [
    { label: "Total Products", value: products.length, icon: "📦" },
    { label: "Total Orders", value: orders.length, icon: "🛒" },
    {
      label: "Total Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: "💰",
    },
    { label: "Total Customers", value: users.length, icon: "👥" },
    {
      label: "Pending Orders",
      value: pendingOrders,
      icon: "📋",
      warn: pendingOrders > 0,
    },
    {
      label: "Out of Stock",
      value: outOfStock,
      icon: "⚠️",
      danger: outOfStock > 0,
    },
    {
      label: "Avg Order Value",
      value: `₹${avgOrderValue.toFixed(0)}`,
      icon: "📊",
    },
    { label: "Categories", value: data.categories.length, icon: "🏷️" },
  ];

  return (
    <AdminLayout>
      <p className="text-xs text-ink/40 mb-1">AURA / Dashboard</p>
      <h1 className="text-xl font-semibold text-ink mb-6">
        Dashboard Overview
      </h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-ink/10 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-ink/50">{s.label}</p>
              <span className="w-8 h-8 rounded-lg bg-cream/60 flex items-center justify-center text-sm">
                {s.icon}
              </span>
            </div>
            <p
              className={`text-2xl font-semibold ${s.danger ? "text-danger" : s.warn ? "text-amber-600" : "text-ink"}`}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-xl p-5">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="font-medium text-ink">Revenue Trend</p>
              <p className="text-xs text-ink/40">
                Daily breakdown of total store sales over the past week
              </p>
            </div>
            <p className="text-sm font-medium text-ink">
              ₹{todayRevenue.toLocaleString("en-IN")} Today
            </p>
          </div>
          {revenueDays.length === 0 ? (
            <p className="text-sm text-ink/40 py-10 text-center">
              No revenue data yet.
            </p>
          ) : (
            <div className="flex items-end gap-3 h-40 mt-4">
              {revenueDays.map(([day, val]) => (
                <div
                  key={day}
                  className="flex-1 flex flex-col items-center gap-1.5"
                >
                  <div
                    className="w-full bg-accent/70 rounded-t"
                    style={{
                      height: `${(val / maxRevenue) * 100}%`,
                      minHeight: val > 0 ? "4px" : "0",
                    }}
                  />
                  <span className="text-[10px] text-ink/40">
                    {day.slice(0, 5)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border border-ink/10 rounded-xl p-5">
          <div className="flex justify-between items-center mb-4">
            <p className="font-medium text-ink">Top Selling Products</p>
            <Link to="/products" className="text-xs text-accent">
              View All
            </Link>
          </div>
          {!analytics?.topProducts?.length ? (
            <p className="text-sm text-ink/40">No sales yet.</p>
          ) : (
            <div className="space-y-3">
              {analytics.topProducts.map(([name, qty]) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink truncate max-w-[140px]">
                      {name}
                    </p>
                    <p className="text-xs text-ink/40">{qty} units sold</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-ink/10">
          <div>
            <p className="font-medium text-ink">Recent Orders</p>
            <p className="text-xs text-ink/40">
              Latest transactions across the store platform
            </p>
          </div>
          <input
            type="text"
            placeholder="Filter by customer or order ID…"
            value={orderFilter}
            onChange={(e) => {
              setOrderFilter(e.target.value);
              setPage(1);
            }}
            className="border border-ink/10 rounded-lg px-3 py-2 text-sm w-full sm:w-64 outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {!paginatedOrders.length ? (
          <p className="p-6 text-ink/50">No orders found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="text-left text-ink/40 border-b border-ink/10 bg-cream/40">
                    <th className="py-3 px-5">Order ID</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((o) => (
                    <tr
                      key={o._id}
                      className="border-b border-ink/5 hover:bg-cream/30"
                    >
                      <td className="py-3 px-5">
                        <Link to={`/orders/${o._id}`} className="text-accent">
                          #{o._id.slice(-6).toUpperCase()}
                        </Link>
                      </td>
                      <td>{o.user?.username || "—"}</td>
                      <td>₹{o.totalPrice}</td>
                      <td
                        className={statusColor[o.orderstatus] || "text-ink/60"}
                      >
                        {o.orderstatus}
                      </td>
                      <td>
                        {new Date(o.createdAt).toLocaleDateString("en-IN")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <p className="text-sm text-ink/50">
                Showing {paginatedOrders.length} of {filteredOrders.length}{" "}
                orders
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-ink/10 text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .slice(0, 3)
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
