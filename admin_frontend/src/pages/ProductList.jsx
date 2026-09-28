import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import ConfirmModal from "../components/ConfirmModal";
import { getProducts, deleteProduct } from "../api/productApi";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
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

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold text-ink">Products</h1>
        <Link
          to="/products/add"
          className="bg-ink text-white px-4 py-2 rounded text-sm"
        >
          + Add Product
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search products…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-ink/15 rounded px-3 py-2 text-sm w-64 mb-4"
      />

      <div className="bg-white border border-ink/10 rounded overflow-x-auto">
        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !filtered.length ? (
          <p className="p-6 text-ink/50">No products found.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/40 border-b border-ink/10">
                <th className="py-3 px-4">Image</th>
                <th>Name</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p._id} className="border-b border-ink/5">
                  <td className="py-3 px-4">
                    <img
                      src={p.img}
                      alt=""
                      className="w-10 h-10 object-cover rounded"
                    />
                  </td>
                  <td>{p.name}</td>
                  <td className="capitalize">{p.category}</td>
                  <td>₹{p.price.toLocaleString("en-IN")}</td>
                  <td className={p.stock === 0 ? "text-danger" : ""}>
                    {p.stock}
                  </td>
                  <td className="space-x-3">
                    <Link
                      to={`/products/${p._id}/edit`}
                      className="text-accent"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => setDeleteId(p._id)}
                      className="text-danger"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
