import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import ConfirmModal from "../components/ConfirmModal";
import {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} from "../api/bannerApi";

export default function BannerList() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    image: "",
    link: "",
    position: "hero",
    order: 0,
  });
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getBanners()
      .then((res) => setBanners(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createBanner(form);
      setShowForm(false);
      setForm({ title: "", image: "", link: "", position: "hero", order: 0 });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleStatus = async (b) => {
    await updateBanner(b._id, {
      status: b.status === "active" ? "inactive" : "active",
    });
    load();
  };

  const handleDelete = async () => {
    await deleteBanner(deleteId);
    setDeleteId(null);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold text-ink">Banners / CMS</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-ink text-white px-4 py-2 rounded text-sm"
        >
          + Add Banner
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-ink/10 rounded p-5 mb-5 max-w-md space-y-3"
        >
          {error && <p className="text-sm text-danger">{error}</p>}
          <input
            placeholder="Title"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
          <input
            placeholder="Image URL"
            required
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
          <input
            placeholder="Link (optional)"
            value={form.link}
            onChange={(e) => setForm({ ...form, link: e.target.value })}
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
          <select
            value={form.position}
            onChange={(e) => setForm({ ...form, position: e.target.value })}
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          >
            <option value="hero">Hero</option>
            <option value="promo">Promo</option>
            <option value="featured">Featured</option>
          </select>
          <input
            type="number"
            placeholder="Display Order"
            value={form.order}
            onChange={(e) =>
              setForm({ ...form, order: Number(e.target.value) })
            }
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="bg-ink text-white px-4 py-2 rounded text-sm"
          >
            Create
          </button>
        </form>
      )}

      <div className="bg-white border border-ink/10 rounded overflow-x-auto">
        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/40 border-b border-ink/10">
                <th className="py-3 px-4">Image</th>
                <th>Title</th>
                <th>Position</th>
                <th>Order</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((b) => (
                <tr key={b._id} className="border-b border-ink/5">
                  <td className="py-3 px-4">
                    <img
                      src={b.image}
                      alt=""
                      className="w-16 h-10 object-cover rounded"
                    />
                  </td>
                  <td>{b.title}</td>
                  <td className="capitalize">{b.position}</td>
                  <td>{b.order}</td>
                  <td>
                    <button
                      onClick={() => toggleStatus(b)}
                      className={
                        b.status === "active" ? "text-green-600" : "text-ink/40"
                      }
                    >
                      {b.status}
                    </button>
                  </td>
                  <td>
                    <button
                      onClick={() => setDeleteId(b._id)}
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
          message="Delete this banner?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </AdminLayout>
  );
}
