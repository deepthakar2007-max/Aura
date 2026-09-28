import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { getProduct, createProduct, updateProduct } from "../api/productApi";

export default function ProductForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    stock: "",
    description: "",
    img: "",
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isEdit) getProduct(id).then((res) => setForm(res.data));
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
      };
      if (isEdit) await updateProduct(id, payload);
      else await createProduct(payload);
      navigate("/products");
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold text-ink mb-5">
        {isEdit ? "Edit Product" : "Add Product"}
      </h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-ink/10 rounded p-6 max-w-lg space-y-4"
      >
        {error && (
          <p className="text-sm bg-red-50 text-danger border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}
        <div>
          <label className="text-sm text-ink/70">Name</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-1 w-full border border-ink/15 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Price (₹)</label>
          <input
            name="price"
            type="number"
            required
            value={form.price}
            onChange={handleChange}
            className="mt-1 w-full border border-ink/15 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Category</label>
          <input
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="mt-1 w-full border border-ink/15 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Stock</label>
          <input
            name="stock"
            type="number"
            required
            value={form.stock}
            onChange={handleChange}
            className="mt-1 w-full border border-ink/15 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Image URL</label>
          <input
            name="img"
            value={form.img}
            onChange={handleChange}
            className="mt-1 w-full border border-ink/15 rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="text-sm text-ink/70">Description</label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            className="mt-1 w-full border border-ink/15 rounded px-3 py-2"
          />
        </div>
        <button
          type="submit"
          disabled={busy}
          className="bg-ink text-white px-6 py-2.5 rounded disabled:opacity-60"
        >
          {busy ? "Saving…" : isEdit ? "Update Product" : "Add Product"}
        </button>
      </form>
    </AdminLayout>
  );
}
