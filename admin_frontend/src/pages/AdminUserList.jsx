import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import ConfirmModal from "../components/ConfirmModal";
import {
  getAdminUsers,
  createAdminUser,
  deleteAdminUser,
} from "../api/adminUserApi";

const ROLES = ["Super Admin", "Admin", "Manager", "Staff"];

export default function AdminUserList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({ userId: "", adminRole: "Staff" });
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getAdminUsers()
      .then((res) => setAdmins(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createAdminUser(form);
      setShowForm(false);
      setForm({ userId: "", adminRole: "Staff" });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async () => {
    await deleteAdminUser(deleteId);
    setDeleteId(null);
    load();
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold text-ink">Admin Users & Roles</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-ink text-white px-4 py-2 rounded text-sm"
        >
          + Add Admin
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-ink/10 rounded p-5 mb-5 max-w-md space-y-3"
        >
          {error && <p className="text-sm text-danger">{error}</p>}
          <input
            placeholder="User ID (existing customer)"
            required
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
          <select
            value={form.adminRole}
            onChange={(e) => setForm({ ...form, adminRole: e.target.value })}
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          >
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <p className="text-xs text-ink/40">
            Note: Copy User ID from Customers page.
          </p>
          <button
            type="submit"
            className="bg-ink text-white px-4 py-2 rounded text-sm"
          >
            Grant Admin Access
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
                <th className="py-3 px-4">Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {admins.map((a) => (
                <tr key={a._id} className="border-b border-ink/5">
                  <td className="py-3 px-4">{a.user?.username}</td>
                  <td>{a.user?.email}</td>
                  <td>{a.adminRole}</td>
                  <td>
                    <button
                      onClick={() => setDeleteId(a._id)}
                      className="text-danger"
                    >
                      Revoke Access
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
          message="Revoke admin access for this user?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </AdminLayout>
  );
}
