import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { getInventory, adjustStock } from "../api/inventoryApi";

const LOW_STOCK_THRESHOLD = 5;
const PER_PAGE = 4;

function toCSV(products) {
  const headers = ["Name", "SKU", "Category", "Stock"];
  const rows = products.map((p) => [
    p.name,
    p._id.slice(-8).toUpperCase(),
    p.category,
    p.stock,
  ]);
  return [headers, ...rows]
    .map((r) => r.map((v) => `"${v}"`).join(","))
    .join("\n");
}

export default function InventoryList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [adjustingId, setAdjustingId] = useState(null);
  const [form, setForm] = useState({ type: "add", quantity: "" });

  const load = () => {
    setLoading(true);
    getInventory()
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleAdjust = async (id) => {
    if (!form.quantity) return;
    await adjustStock(id, { type: form.type, quantity: Number(form.quantity) });
    setAdjustingId(null);
    setForm({ type: "add", quantity: "" });
    load();
  };

  const handleExport = () => {
    const blob = new Blob([toCSV(filteredByTab)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const lowStockItems = products.filter(
    (p) => p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD,
  );
  const outOfStockItems = products.filter((p) => p.stock === 0);

  const filteredByTab =
    tab === "low" ? lowStockItems : tab === "out" ? outOfStockItems : products;

  const filtered = filteredByTab.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p._id.toLowerCase().includes(search.toLowerCase()),
  );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const statusBadge = (stock) => {
    if (stock === 0)
      return { text: "Out of Stock", cls: "text-danger", dot: "bg-danger" };
    if (stock <= LOW_STOCK_THRESHOLD)
      return { text: "Low Stock", cls: "text-amber-600", dot: "bg-amber-500" };
    return { text: "In Stock", cls: "text-green-600", dot: "bg-green-500" };
  };

  return (
    <AdminLayout>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink">Inventory</h1>
          <p className="text-sm text-ink/50 mt-0.5">
            Track and adjust stock levels in real time
          </p>
        </div>
        <button
          onClick={handleExport}
          className="border border-ink/10 rounded-lg px-4 py-2 text-sm text-ink hover:bg-cream/40 transition-colors whitespace-nowrap"
        >
          ↓ Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Total Tracked SKUs
          </p>
          <p className="text-2xl font-semibold text-ink mt-1">
            {products.length}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Low Stock Alert
          </p>
          <p className="text-2xl font-semibold text-amber-600 mt-1">
            {lowStockItems.length}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Out of Stock
          </p>
          <p className="text-2xl font-semibold text-danger mt-1">
            {outOfStockItems.length}
          </p>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-3 p-4 border-b border-ink/10">
          <div className="flex gap-2 flex-wrap">
            {[
              { id: "all", label: `All Products (${products.length})` },
              { id: "low", label: `Low Stock (${lowStockItems.length})` },
              { id: "out", label: `Out of Stock (${outOfStockItems.length})` },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => {
                  setTab(t.id);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap ${tab === t.id ? "bg-ink text-white" : "bg-cream/60 text-ink/60"}`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Filter by name or SKU…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 border border-ink/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !paginated.length ? (
          <p className="text-center py-16 text-ink/50">No products found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="text-left text-ink/40 border-b border-ink/10 bg-cream/40 uppercase text-xs">
                    <th className="py-3 px-4">Product Name</th>
                    <th>SKU</th>
                    <th>Current Stock</th>
                    <th>Status</th>
                    <th className="pr-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p) => {
                    const badge = statusBadge(p.stock);
                    return (
                      <tr
                        key={p._id}
                        className="border-b border-ink/5 hover:bg-cream/30"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={p.img}
                              alt=""
                              className="w-11 h-11 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-medium text-ink truncate">
                                {p.name}
                              </p>
                              <p className="text-xs text-ink/40 capitalize">
                                {p.category}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="text-ink/60 font-mono text-xs">
                          {p._id.slice(-8).toUpperCase()}
                        </td>
                        <td className="font-medium">{p.stock}</td>
                        <td>
                          <span
                            className={`flex items-center gap-1.5 text-sm ${badge.cls}`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}
                            />
                            {badge.text}
                          </span>
                        </td>
                        <td className="pr-4">
                          {adjustingId === p._id ? (
                            <div className="flex gap-2 items-center flex-wrap">
                              <select
                                value={form.type}
                                onChange={(e) =>
                                  setForm({ ...form, type: e.target.value })
                                }
                                className="border border-ink/10 rounded-lg px-2 py-1.5 text-xs"
                              >
                                <option value="add">Add</option>
                                <option value="remove">Remove</option>
                              </select>
                              <input
                                type="number"
                                value={form.quantity}
                                onChange={(e) =>
                                  setForm({ ...form, quantity: e.target.value })
                                }
                                className="border border-ink/10 rounded-lg px-2 py-1.5 text-xs w-16"
                              />
                              <button
                                onClick={() => handleAdjust(p._id)}
                                className="text-accent text-xs font-medium"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => setAdjustingId(null)}
                                className="text-ink/40 text-xs"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => {
                                setAdjustingId(p._id);
                                setForm({ type: "add", quantity: "" });
                              }}
                              className="border border-ink/10 rounded-lg px-3 py-1.5 text-xs text-ink whitespace-nowrap"
                            >
                              Adjust Stock
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-ink/10">
              <p className="text-sm text-ink/50">
                Showing {(page - 1) * PER_PAGE + 1}–
                {Math.min(page * PER_PAGE, filtered.length)} of{" "}
                {filtered.length} SKUs
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
