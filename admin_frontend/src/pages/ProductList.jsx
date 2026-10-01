import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import ConfirmModal from "../components/ConfirmModal";
import { getProducts, deleteProduct } from "../api/productApi";

const PER_PAGE = 5;

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

  const load = () => {
    setLoading(true);
    getProducts()
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    await deleteProduct(deleteId);
    setDeleteId(null);
    load();
  };

  const categories = [...new Set(products.map((p) => p.category))];

  const filtered = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "" || p.category === category;
    return matchesSearch && matchesCategory;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const totalProducts = products.length;
  const activeStock = products.filter((p) => p.stock > 5).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock <= 5).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;

  const stockBadge = (stock) => {
    if (stock === 0)
      return { text: `Out of Stock (0)`, cls: "bg-red-100 text-danger" };
    if (stock <= 5)
      return {
        text: `Low Stock (${stock})`,
        cls: "bg-amber-100 text-amber-700",
      };
    return { text: `In Stock (${stock})`, cls: "bg-green-100 text-green-700" };
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setPage(1);
  };

  return (
    <AdminLayout>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink">Products Catalog</h1>
          <p className="text-sm text-ink/50 mt-0.5">
            Manage your luxury inventory, pricing, and stock levels.
          </p>
        </div>
        <div className="flex gap-2">
          <select
            value={category}
            onChange={handleCategoryChange}
            className="bg-cream/60 border border-ink/10 rounded-lg px-3 py-2 text-sm capitalize"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c} className="capitalize">
                {c}
              </option>
            ))}
          </select>
          <Link
            to="/products/add"
            className="bg-ink text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ink/85 transition-colors"
          >
            + Add Product
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-sm text-ink/50">Total Products</p>
          <p className="text-2xl font-semibold text-ink mt-1">
            {totalProducts}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-sm text-ink/50">Active Stock</p>
          <p className="text-2xl font-semibold text-ink mt-1">{activeStock}</p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-sm text-ink/50">Low Stock Alert</p>
          <p className="text-2xl font-semibold text-amber-600 mt-1">
            {lowStock}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-sm text-ink/50">Out of Stock</p>
          <p className="text-2xl font-semibold text-danger mt-1">
            {outOfStock}
          </p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search products…"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setPage(1);
        }}
        className="border border-ink/10 rounded-lg px-3 py-2 text-sm w-full sm:w-72 mb-4 outline-none focus:ring-2 focus:ring-accent/30"
      />

      <div className="bg-white border border-ink/10 rounded-xl overflow-x-auto">
        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !paginated.length ? (
          <p className="p-6 text-ink/50">
            No products found{category && ` in "${category}"`}.
          </p>
        ) : (
          <>
            <table className="w-full text-sm min-w-[640px]">
              <thead>
                <tr className="text-left text-ink/40 border-b border-ink/10 bg-cream/40">
                  <th className="py-3 px-4">Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock Status</th>
                  <th className="pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => {
                  const badge = stockBadge(p.stock);
                  return (
                    <tr
                      key={p._id}
                      className="border-b border-ink/5 hover:bg-cream/30 transition-colors"
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
                            <p className="text-xs text-ink/40">
                              SKU: {p._id.slice(-8).toUpperCase()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="capitalize">{p.category}</td>
                      <td>₹{p.price.toLocaleString("en-IN")}</td>
                      <td>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${badge.cls}`}
                        >
                          {badge.text}
                        </span>
                      </td>
                      <td className="pr-4">
                        <div className="flex gap-3">
                          <Link
                            to={`/products/${p._id}/edit`}
                            className="text-accent"
                          >
                            ✎
                          </Link>
                          <button
                            onClick={() => setDeleteId(p._id)}
                            className="text-danger"
                          >
                            🗑
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

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

      {deleteId && (
        <ConfirmModal
          message="Delete this product? This cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </AdminLayout>
  );
}
