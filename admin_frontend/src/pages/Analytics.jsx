import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { getAnalytics } from "../api/analyticsApi";

const PER_PAGE = 4;

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getAnalytics()
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <AdminLayout>
        <p className="text-ink/50">Loading analytics…</p>
      </AdminLayout>
    );
  if (!data) return null;

  const revenueDays = Object.entries(data.revenueByDay).slice(-7);
  const maxRevenue = Math.max(...revenueDays.map(([, v]) => v), 1);
  const totalCategorySales = Object.values(data.salesByCategory).reduce(
    (a, b) => a + b,
    0,
  );

  const filteredProducts = data.topProducts.filter(([name]) =>
    name.toLowerCase().includes(search.toLowerCase()),
  );
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PER_PAGE));
  const paginated = filteredProducts.slice(
    (page - 1) * PER_PAGE,
    page * PER_PAGE,
  );

  const handleExport = () => {
    const rows = [["Product", "Units Sold"], ...data.topProducts];
    const csv = rows.map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "top_products.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const stats = [
    {
      label: "Total Revenue",
      value: `₹${data.totalRevenue.toLocaleString("en-IN")}`,
      icon: "💰",
    },
    { label: "Total Orders", value: data.totalOrders, icon: "🛒" },
    {
      label: "Avg Order Value",
      value: `₹${data.avgOrderValue.toFixed(0)}`,
      icon: "📊",
    },
    { label: "Total Customers", value: data.totalCustomers, icon: "👥" },
  ];

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold text-ink mb-6">Analytics</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div
            key={s.label}
            className="bg-white border border-ink/10 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs uppercase tracking-wide text-ink/40">
                {s.label}
              </p>
              <span className="w-8 h-8 rounded-lg bg-cream/60 flex items-center justify-center text-sm">
                {s.icon}
              </span>
            </div>
            <p className="text-2xl font-semibold text-ink">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-5 mb-6">
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-xl p-5">
          <p className="font-medium text-ink">Revenue by Day</p>
          <p className="text-xs text-ink/40 mb-4">
            Daily earnings overview for the current week
          </p>
          {!revenueDays.length ? (
            <p className="text-sm text-ink/40 py-10 text-center">
              No revenue data yet.
            </p>
          ) : (
            <div className="flex items-end gap-3 h-48">
              {revenueDays.map(([day, val]) => (
                <div
                  key={day}
                  className="flex-1 flex flex-col items-center gap-2"
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
          <p className="font-medium text-ink">Sales by Category</p>
          <p className="text-xs text-ink/40 mb-4">
            Distribution across all product categories
          </p>
          {!Object.keys(data.salesByCategory).length ? (
            <p className="text-sm text-ink/40">No sales data yet.</p>
          ) : (
            <div className="space-y-3">
              {Object.entries(data.salesByCategory)
                .sort((a, b) => b[1] - a[1])
                .map(([cat, val]) => {
                  const pct = totalCategorySales
                    ? (val / totalCategorySales) * 100
                    : 0;
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="capitalize text-ink">{cat}</span>
                        <span className="text-ink/50">
                          {pct.toFixed(0)}% (₹{val.toLocaleString("en-IN")})
                        </span>
                      </div>
                      <div className="h-1.5 bg-cream rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-ink/10">
          <div>
            <p className="font-medium text-ink">Top Selling Products</p>
            <p className="text-xs text-ink/40">Products ranked by units sold</p>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Filter products…"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="border border-ink/10 rounded-lg px-3 py-2 text-sm w-full sm:w-56 outline-none focus:ring-2 focus:ring-accent/30"
            />
            <button
              onClick={handleExport}
              className="bg-ink text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ink/85 transition-colors whitespace-nowrap"
            >
              Export CSV
            </button>
          </div>
        </div>

        {!paginated.length ? (
          <p className="p-6 text-ink/50">No products found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[500px]">
                <thead>
                  <tr className="text-left text-ink/40 border-b border-ink/10 bg-cream/40 uppercase text-xs">
                    <th className="py-3 px-5">Product</th>
                    <th>Units Sold</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map(([name, qty]) => (
                    <tr
                      key={name}
                      className="border-b border-ink/5 hover:bg-cream/30"
                    >
                      <td className="py-3 px-5 font-medium text-ink">{name}</td>
                      <td>{qty}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between gap-3 px-5 py-4">
              <p className="text-sm text-ink/50">
                Showing {paginated.length} of {filteredProducts.length} products
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-ink/10 text-sm disabled:opacity-40"
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`w-9 h-9 rounded-lg text-sm ${page === n ? "bg-ink text-white" : "border border-ink/10 text-ink/60"}`}
                    >
                      {n}
                    </button>
                  ),
                )}
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
