import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import StatCard from "../components/StatCard";
import { getDashboardStats } from "../api/dashboardApi";

export default function Dashboard() {
  const [data, setData] = useState({
    products: [],
    orders: [],
    users: [],
    categories: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboardStats()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <AdminLayout>
        <p>Loading dashboard…</p>
      </AdminLayout>
    );

  const { products, orders, users, categories } = data;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const pendingOrders = orders.filter(
    (o) => o.orderstatus === "Pending",
  ).length;
  const completedOrders = orders.filter(
    (o) => o.orderstatus === "Delivered",
  ).length;
  const cancelledOrders = orders.filter(
    (o) => o.orderstatus === "Cancelled",
  ).length;
  const totalRevenue = orders.reduce((s, o) => s + (o.totalPrice || 0), 0);
  const today = new Date().toDateString();
  const todayRevenue = orders
    .filter((o) => new Date(o.createdAt).toDateString() === today)
    .reduce((s, o) => s + o.totalPrice, 0);
  const recentOrders = orders.slice(0, 5);

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold text-ink mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Products" value={products.length} />
        <StatCard label="Out of Stock" value={outOfStock} />
        <StatCard label="Total Categories" value={categories.length} />
        <StatCard label="Total Customers" value={users.length} />
        <StatCard label="Total Orders" value={orders.length} />
        <StatCard label="Pending Orders" value={pendingOrders} />
        <StatCard label="Completed Orders" value={completedOrders} />
        <StatCard label="Cancelled Orders" value={cancelledOrders} />
        <StatCard
          label="Total Revenue"
          value={`₹${totalRevenue.toLocaleString("en-IN")}`}
        />
        <StatCard
          label="Today's Revenue"
          value={`₹${todayRevenue.toLocaleString("en-IN")}`}
        />
      </div>

      <div className="bg-white border border-ink/10 rounded p-5">
        <div className="flex justify-between items-center mb-4">
          <p className="font-medium text-ink">Recent Orders</p>
          <Link to="/orders" className="text-sm text-accent">
            View all
          </Link>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-ink/40 border-b border-ink/10">
              <th className="py-2">Order</th>
              <th>Customer</th>
              <th>Status</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((o) => (
              <tr key={o._id} className="border-b border-ink/5">
                <td className="py-2">#{o._id.slice(-6).toUpperCase()}</td>
                <td>{o.user?.username || "—"}</td>
                <td>{o.orderstatus}</td>
                <td>₹{o.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}
