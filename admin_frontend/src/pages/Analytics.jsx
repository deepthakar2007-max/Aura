import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import StatCard from "../components/StatCard";
import { getAnalytics } from "../api/analyticsApi";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnalytics()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <AdminLayout>
        <p>Loading…</p>
      </AdminLayout>
    );
  if (!data) return null;

  const revenueDays = Object.entries(data.revenueByDay).slice(-7);
  const maxRevenue = Math.max(...revenueDays.map(([, v]) => v), 1);

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold text-ink mb-5">Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="Total Revenue"
          value={`₹${data.totalRevenue.toLocaleString("en-IN")}`}
        />
        <StatCard label="Total Orders" value={data.totalOrders} />
        <StatCard
          label="Avg Order Value"
          value={`₹${data.avgOrderValue.toFixed(0)}`}
        />
        <StatCard label="Total Customers" value={data.totalCustomers} />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div className="bg-white border border-ink/10 rounded p-5">
          <p className="font-medium mb-4">Revenue (Last 7 Days)</p>
          <div className="flex items-end gap-3 h-40">
            {revenueDays.map(([day, val]) => (
              <div
                key={day}
                className="flex-1 flex flex-col items-center gap-1"
              >
                <div
                  className="w-full bg-ink rounded-t"
                  style={{ height: `${(val / maxRevenue) * 100}%` }}
                />
                <span className="text-[10px] text-ink/40">
                  {day.slice(0, 5)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-ink/10 rounded p-5">
          <p className="font-medium mb-4">Sales by Category</p>
          {Object.entries(data.salesByCategory).map(([cat, val]) => (
            <div
              key={cat}
              className="flex justify-between text-sm py-1.5 border-b border-ink/5"
            >
              <span className="capitalize">{cat}</span>
              <span>₹{val.toLocaleString("en-IN")}</span>
            </div>
          ))}
        </div>

        <div className="bg-white border border-ink/10 rounded p-5 md:col-span-2">
          <p className="font-medium mb-4">Top Selling Products</p>
          {data.topProducts.map(([name, qty]) => (
            <div
              key={name}
              className="flex justify-between text-sm py-1.5 border-b border-ink/5"
            >
              <span>{name}</span>
              <span>{qty} sold</span>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
