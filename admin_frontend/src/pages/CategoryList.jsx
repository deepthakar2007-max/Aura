import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import ConfirmModal from "../components/ConfirmModal";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categoryApi";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
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
    getCategories()
      .then((res) => setCategories(res.data))
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

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold text-ink">Categories</h1>
        <button
          onClick={openAdd}
          className="bg-ink text-white px-4 py-2 rounded text-sm"
        >
          + Add Category
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-ink/10 rounded p-5 mb-5 max-w-md space-y-3"
        >
          {error && <p className="text-sm text-danger">{error}</p>}
          <input
            placeholder="Name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
          <input
            placeholder="Image URL"
            value={form.img}
            onChange={(e) => setForm({ ...form, img: e.target.value })}
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-ink text-white px-4 py-2 rounded text-sm"
            >
              {editing ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="border border-ink/15 px-4 py-2 rounded text-sm"
            >
              Cancel
            </button>
          </div>
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
                <th>Name</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c._id} className="border-b border-ink/5">
                  <td className="py-3 px-4">
                    <img
                      src={c.img}
                      alt=""
                      className="w-10 h-10 object-cover rounded"
                    />
                  </td>
                  <td className="capitalize">{c.name}</td>
                  <td>{c.status}</td>
                  <td className="space-x-3">
                    <button onClick={() => openEdit(c)} className="text-accent">
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteId(c._id)}
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
          message="Delete this category?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </AdminLayout>
  );
}
