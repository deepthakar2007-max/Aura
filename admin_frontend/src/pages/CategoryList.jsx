import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import ConfirmModal from "../components/ConfirmModal";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";
import { getProducts } from "../api/productApi";

const PER_PAGE = 4;

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    img: "",
    description: "",
    status: "active",
  });
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    Promise.all([getCategories(), getProducts()])
      .then(([catRes, prodRes]) => {
        setCategories(catRes.data);
        const counts = {};
        prodRes.data.forEach((p) => {
          counts[p.category] = (counts[p.category] || 0) + 1;
        });
        setProductCounts(counts);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setForm({ name: "", img: "", description: "", status: "active" });
    setEditing(null);
    setShowForm(true);
  };
  const openEdit = (cat) => {
    setForm(cat);
    setEditing(cat._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) await updateCategory(editing, form);
      else await createCategory(form);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    await deleteCategory(deleteId);
    setDeleteId(null);
    load();
  };

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) &&
      (!statusFilter || c.status === statusFilter),
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalProducts = Object.values(productCounts).reduce((a, b) => a + b, 0);
  const activeCount = categories.filter((c) => c.status === "active").length;

  return (
    <AdminLayout>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink">Categories</h1>
          <p className="text-sm text-ink/50 mt-0.5">
            Organize your product catalog into collections
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-ink text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ink/85 transition-colors"
        >
          + Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Total Categories
          </p>
          <p className="text-2xl font-semibold text-ink mt-1">
            {categories.length}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Active Collections
          </p>
          <p className="text-2xl font-semibold text-ink mt-1">{activeCount}</p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Total Products Mapped
          </p>
          <p className="text-2xl font-semibold text-ink mt-1">
            {totalProducts}
          </p>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-ink/10 rounded-xl p-5 mb-5 max-w-md space-y-3"
        >
          {error && <p className="text-sm text-danger">{error}</p>}
          <input
            placeholder="Category name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-ink/10 rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Image URL"
            value={form.img}
            onChange={(e) => setForm({ ...form, img: e.target.value })}
            className="w-full border border-ink/10 rounded-lg px-3 py-2 text-sm"
          />
          {form.img && (
            <img
              src={form.img}
              alt=""
              className="w-16 h-16 object-cover rounded-lg"
            />
          )}
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-ink/10 rounded-lg px-3 py-2 text-sm"
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full border border-ink/10 rounded-lg px-3 py-2 text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-ink text-white px-4 py-2 rounded-lg text-sm"
            >
              {editing ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border border-ink/10 px-4 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="bg-white border border-ink/10 rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-3 p-4 border-b border-ink/10">
          <input
            type="text"
            placeholder="Filter categories…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 border border-ink/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30"
          />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="border border-ink/10 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !paginated.length ? (
          <div className="text-center py-16">
            <p className="text-ink/50">No categories found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="text-left text-ink/40 border-b border-ink/10 bg-cream/40 uppercase text-xs">
                    <th className="py-3 px-4">Category</th>
                    <th>Description</th>
                    <th>Products</th>
                    <th>Status</th>
                    <th className="pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((c) => (
                    <tr
                      key={c._id}
                      className="border-b border-ink/5 hover:bg-cream/30"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={c.img}
                            alt=""
                            className="w-11 h-11 object-cover rounded-lg flex-shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-medium text-ink capitalize">
                              {c.name}
                            </p>
                            <p className="text-xs text-ink/40">
                              /collections/{c.name.toLowerCase()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="text-ink/60 max-w-[220px] truncate">
                        {c.description || "—"}
                      </td>
                      <td>{productCounts[c.name] || 0}</td>
                      <td>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${c.status === "active" ? "bg-amber-100 text-amber-700" : "bg-gray-100 text-ink/50"}`}
                        >
                          {c.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="pr-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEdit(c)}
                            className="text-accent"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => setDeleteId(c._id)}
                            className="text-danger"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-ink/10">
              <p className="text-sm text-ink/50">
                Showing {(page - 1) * PER_PAGE + 1} to{" "}
                {Math.min(page * PER_PAGE, filtered.length)} of{" "}
                {filtered.length} entries
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

      {deleteId && (
        <ConfirmModal
          message="Delete this category?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </AdminLayout>
  );
}
