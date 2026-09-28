import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { getInventory, adjustStock } from "../api/inventoryApi";

const LOW_STOCK_THRESHOLD = 5;

export default function InventoryList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
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
    await adjustStock(id, { type: form.type, quantity: Number(form.quantity) });
    setAdjustingId(null);
    setForm({ type: "add", quantity: "" });
    load();
  };

  const filtered = products.filter((p) => {
    if (filter === "low") return p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD;
    if (filter === "out") return p.stock === 0;
    return true;
  });

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold text-ink mb-5">Inventory</h1>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border border-ink/15 rounded px-3 py-2 text-sm mb-4"
      >
        <option value="">All Products</option>
        <option value="low">Low Stock (≤{LOW_STOCK_THRESHOLD})</option>
        <option value="out">Out of Stock</option>
      </select>

      <div className="bg-white border border-ink/10 rounded overflow-x-auto">
        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/40 border-b border-ink/10">
                <th className="py-3 px-4">Product</th>
                <th>SKU</th>
                <th>Stock</th>
                <th>Status</th>
                <th>Adjust</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-b border-ink/5">
                  <td className="py-3 px-4">{p.name}</td>
                  <td>{p._id.slice(-6).toUpperCase()}</td>
                  <td>{p.stock}</td>
                  <td>
                    {p.stock === 0 ? (
                      <span className="text-danger">Out of Stock</span>
                    ) : p.stock <= LOW_STOCK_THRESHOLD ? (
                      <span className="text-yellow-600">Low Stock</span>
                    ) : (
                      <span className="text-green-600">In Stock</span>
                    )}
                  </td>
                  <td>
                    {adjustingId === p._id ? (
                      <div className="flex gap-2 items-center">
                        <select
                          value={form.type}
                          onChange={(e) =>
                            setForm({ ...form, type: e.target.value })
                          }
                          className="border border-ink/15 rounded px-2 py-1 text-xs"
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
                          className="border border-ink/15 rounded px-2 py-1 text-xs w-16"
                        />
                        <button
                          onClick={() => handleAdjust(p._id)}
                          className="text-accent text-xs"
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
                        onClick={() => setAdjustingId(p._id)}
                        className="text-accent text-xs"
                      >
                        Adjust Stock
                      </button>
                    )}
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
