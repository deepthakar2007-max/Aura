import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import ConfirmModal from "../components/ConfirmModal";
import {
  getAdminUsers,
  createAdminUser,
  deleteAdminUser,
} from "../api/adminUserApi";

const PER_PAGE = 5;
const ROLES = ["Super Admin", "Admin", "Manager", "Staff"];

const roleBadge = {
  "Super Admin": "bg-purple-100 text-purple-700",
  Admin: "bg-blue-100 text-blue-700",
  Manager: "bg-amber-100 text-amber-700",
  Staff: "bg-gray-100 text-ink/60",
};

export default function AdminUserList() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);
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

  const initials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "?";

  const filtered = admins.filter((a) => {
    const matchesSearch =
      a.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
      a.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || a.adminRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const superAdminCount = admins.filter(
    (a) => a.adminRole === "Super Admin",
  ).length;
  const staffCount = admins.filter((a) => a.adminRole === "Staff").length;

  return (
    <AdminLayout>
      <p className="text-xs text-ink/40 mb-1">
        Administration /{" "}
        <span className="text-accent uppercase">Access Control</span>
      </p>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
        <h1 className="text-2xl font-semibold text-ink">Admin Users & Roles</h1>
        <div className="flex gap-2">
          <Link
            to="/activity-logs"
            className="border border-ink/10 px-4 py-2 rounded-lg text-sm whitespace-nowrap"
          >
            🛡 Audit Logs
          </Link>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-ink text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ink/85 transition-colors whitespace-nowrap"
          >
            + Grant Admin Access
          </button>
        </div>
      </div>
      <p className="text-sm text-ink/50 mb-6">
        Manage team access credentials and role assignments.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Total Admins
          </p>
          <p className="text-2xl font-semibold text-ink mt-1">
            {admins.length}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Super Admins
          </p>
          <p className="text-2xl font-semibold text-purple-600 mt-1">
            {superAdminCount}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Staff Members
          </p>
          <p className="text-2xl font-semibold text-ink mt-1">{staffCount}</p>
        </div>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-ink/10 rounded-xl p-5 mb-5 max-w-md space-y-3"
        >
          {error && <p className="text-sm text-danger">{error}</p>}
          <input
            placeholder="User ID (existing customer)"
            required
            value={form.userId}
            onChange={(e) => setForm({ ...form, userId: e.target.value })}
            className="w-full border border-ink/10 rounded-lg px-3 py-2 text-sm"
          />
          <select
            value={form.adminRole}
            onChange={(e) => setForm({ ...form, adminRole: e.target.value })}
            className="w-full border border-ink/10 rounded-lg px-3 py-2 text-sm"
          >
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <p className="text-xs text-ink/40">
            Copy User ID from the Customers page.
          </p>
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-ink text-white px-4 py-2 rounded-lg text-sm"
            >
              Grant Access
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
            placeholder="Filter by name, email or role…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 border border-ink/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30"
          />
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="border border-ink/10 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Roles</option>
            {ROLES.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !paginated.length ? (
          <p className="text-center py-16 text-ink/50">
            No admin users found besides you.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="text-left text-ink/40 border-b border-ink/10 bg-cream/40 uppercase text-xs">
                    <th className="py-3 px-4">Admin User</th>
                    <th>Role & Access</th>
                    <th>Date Granted</th>
                    <th className="pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((a) => (
                    <tr
                      key={a._id}
                      className="border-b border-ink/5 hover:bg-cream/30"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-accent/15 text-accent text-xs flex items-center justify-center flex-shrink-0">
                            {initials(a.user?.username)}
                          </span>
                          <div className="min-w-0">
                            <p className="text-ink truncate">
                              {a.user?.username}
                            </p>
                            <p className="text-xs text-ink/40 truncate">
                              {a.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${roleBadge[a.adminRole]}`}
                        >
                          {a.adminRole}
                        </span>
                      </td>
                      <td className="text-ink/60">
                        {new Date(a.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="pr-4">
                        <button
                          onClick={() => setDeleteId(a._id)}
                          className="text-danger text-sm"
                        >
                          Revoke Access
                        </button>
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
                {filtered.length} admin users
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
          message="Revoke admin access for this user?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </AdminLayout>
  );
}
