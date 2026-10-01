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
    images: ["", "", "", ""],
  });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (isEdit) {
      getProduct(id).then((res) => {
        const data = res.data;
        const imgs = data.images && data.images.length ? [...data.images] : [];
        while (imgs.length < 4) imgs.push("");
        setForm({ ...data, images: imgs.slice(0, 4) });
      });
    }
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleGalleryChange = (index, value) => {
    const updated = [...form.images];
    updated[index] = value;
    setForm({ ...form, images: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const cleanImages = form.images.filter((url) => url.trim() !== "");
      const payload = {
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        images: cleanImages,
        img: form.img || cleanImages[0] || "",
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
        className="bg-white border border-ink/10 rounded-xl p-6 max-w-2xl space-y-5"
      >
        {error && (
          <p className="text-sm bg-red-50 text-danger border border-red-200 rounded-lg px-3 py-2">
            {error}
          </p>
        )}

        <div>
          <label className="text-sm font-medium text-ink">Name</label>
          <input
            name="name"
            required
            value={form.name}
            onChange={handleChange}
            className="mt-1.5 w-full border border-ink/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-ink">Price (₹)</label>
            <input
              name="price"
              type="number"
              required
              value={form.price}
              onChange={handleChange}
              className="mt-1.5 w-full border border-ink/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-ink">Stock</label>
            <input
              name="stock"
              type="number"
              required
              value={form.stock}
              onChange={handleChange}
              className="mt-1.5 w-full border border-ink/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Category</label>
          <input
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="mt-1.5 w-full border border-ink/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <div className="border-t border-ink/10 pt-5">
          <p className="text-sm font-medium text-ink mb-1">
            Main Product Image
          </p>
          <p className="text-xs text-ink/40 mb-2">
            This shows on product listings, cards, and category pages.
          </p>
          <input
            name="img"
            placeholder="https://..."
            value={form.img}
            onChange={handleChange}
            className="w-full border border-ink/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
          />
          {form.img && (
            <img
              src={form.img}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg mt-2 border border-ink/10"
            />
          )}
        </div>

        <div className="border-t border-ink/10 pt-5">
          <p className="text-sm font-medium text-ink mb-1">
            Gallery Images (up to 4)
          </p>
          <p className="text-xs text-ink/40 mb-3">
            Shown on the product detail page as thumbnails below the main image.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {form.images.map((url, i) => (
              <div key={i}>
                <input
                  placeholder={`Image ${i + 1} URL`}
                  value={url}
                  onChange={(e) => handleGalleryChange(i, e.target.value)}
                  className="w-full border border-ink/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30"
                />
                {url && (
                  <img
                    src={url}
                    alt=""
                    className="w-full aspect-square object-cover rounded-lg mt-2 border border-ink/10"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-sm font-medium text-ink">Description</label>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            className="mt-1.5 w-full border border-ink/10 rounded-lg px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="bg-ink text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-ink/85 transition-colors disabled:opacity-60"
        >
          {busy ? "Saving…" : isEdit ? "Update Product" : "Add Product"}
        </button>
      </form>
    </AdminLayout>
  );
}
