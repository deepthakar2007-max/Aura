import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import ConfirmModal from "../components/ConfirmModal";
import {
  getBrands,
  createBrand,
  updateBrand,
  deleteBrand,
} from "../api/brandApi";

const PER_PAGE = 4;

export default function BrandList() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    logo: "",
    description: "",
    status: "active",
  });
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getBrands()
      .then((res) => setBrands(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const openAdd = () => {
    setForm({ name: "", logo: "", description: "", status: "active" });
    setEditing(null);
    setShowForm(true);
  };
  const openEdit = (b) => {
    setForm(b);
    setEditing(b._id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      if (editing) await updateBrand(editing, form);
      else await createBrand(form);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    await deleteBrand(deleteId);
    setDeleteId(null);
    load();
  };

  const filtered = brands
    .filter(
      (b) =>
        b.name.toLowerCase().includes(search.toLowerCase()) &&
        (!statusFilter || b.status === statusFilter),
    )
    .sort((a, b) =>
      sortBy === "name"
        ? a.name.localeCompare(b.name)
        : (b.productCount || 0) - (a.productCount || 0),
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalLinkedProducts = brands.reduce(
    (s, b) => s + (b.productCount || 0),
    0,
  );
  const activeCount = brands.filter((b) => b.status === "active").length;

  return (
    <AdminLayout>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink">Brands</h1>
          <p className="text-sm text-ink/50 mt-0.5">
            Manage manufacturer and designer brand profiles
          </p>
        </div>
        <button
          onClick={openAdd}
          className="bg-ink text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ink/85 transition-colors whitespace-nowrap"
        >
          + Add Brand
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Total Brands
          </p>
          <p className="text-2xl font-semibold text-ink mt-1">
            {brands.length}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Active Manufacturers
          </p>
          <p className="text-2xl font-semibold text-ink mt-1">{activeCount}</p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Total Linked Products
          </p>
          <p className="text-2xl font-semibold text-ink mt-1">
            {totalLinkedProducts}
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
            placeholder="Brand name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-ink/10 rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Logo URL"
            value={form.logo}
            onChange={(e) => setForm({ ...form, logo: e.target.value })}
            className="w-full border border-ink/10 rounded-lg px-3 py-2 text-sm"
          />
          {form.logo && (
            <img
              src={form.logo}
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
            placeholder="Search brands by name…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 border border-ink/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30"
          />
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="border border-ink/10 rounded-lg px-3 py-2 text-sm flex-1 sm:flex-none"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-ink/10 rounded-lg px-3 py-2 text-sm flex-1 sm:flex-none"
            >
              <option value="name">Sort by: Name</option>
              <option value="products">Sort by: Products</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !paginated.length ? (
          <div className="text-center py-16">
            <p className="text-ink/50">No brands found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="text-left text-ink/40 border-b border-ink/10 bg-cream/40 uppercase text-xs">
                    <th className="py-3 px-4">Brand</th>
                    <th>Description</th>
                    <th>Products</th>
                    <th>Status</th>
                    <th className="pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((b) => (
                    <tr
                      key={b._id}
                      className="border-b border-ink/5 hover:bg-cream/30"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.logo}
                            alt=""
                            className="w-11 h-11 object-cover rounded-lg flex-shrink-0 bg-cream"
                          />
                          <p className="font-medium text-ink truncate">
                            {b.name}
                          </p>
                        </div>
                      </td>
                      <td className="text-ink/60 max-w-[220px] truncate">
                        {b.description || "—"}
                      </td>
                      <td>{b.productCount || 0}</td>
                      <td>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${b.status === "active" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}
                        >
                          {b.status === "active" ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="pr-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => openEdit(b)}
                            className="text-accent"
                          >
                            ✎
                          </button>
                          <button
                            onClick={() => setDeleteId(b._id)}
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
                Showing {(page - 1) * PER_PAGE + 1}-
                {Math.min(page * PER_PAGE, filtered.length)} of{" "}
                {filtered.length} brands
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
          message="Delete this brand?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </AdminLayout>
  );
}
