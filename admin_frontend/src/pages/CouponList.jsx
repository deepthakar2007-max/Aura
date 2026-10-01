import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import ConfirmModal from "../components/ConfirmModal";
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../api/couponApi";

const PER_PAGE = 5;

export default function CouponList() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("expiry");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [form, setForm] = useState({
    code: "",
    discount: "",
    discountType: "PERCENTAGE",
    minimumOrderAmount: 0,
    expiryDate: "",
  });
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    getCoupons()
      .then((res) => setCoupons(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await createCoupon({
        ...form,
        discount: Number(form.discount),
        minimumOrderAmount: Number(form.minimumOrderAmount),
      });
      setShowForm(false);
      setForm({
        code: "",
        discount: "",
        discountType: "PERCENTAGE",
        minimumOrderAmount: 0,
        expiryDate: "",
      });
      load();
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleStatus = async (c) => {
    await updateCoupon(c._id, {
      status: c.status === "Active" ? "Inactive" : "Active",
    });
    load();
  };

  const handleDelete = async () => {
    await deleteCoupon(deleteId);
    setDeleteId(null);
    load();
  };

  const isExpired = (c) => new Date(c.expiryDate) < new Date();
  const activeCount = coupons.filter(
    (c) => c.status === "Active" && !isExpired(c),
  ).length;
  const expiredOrInactive = coupons.filter(
    (c) => c.status === "Inactive" || isExpired(c),
  ).length;

  const filtered = coupons
    .filter(
      (c) =>
        c.code.toLowerCase().includes(search.toLowerCase()) &&
        (!statusFilter || c.status === statusFilter),
    )
    .sort((a, b) =>
      sortBy === "expiry"
        ? new Date(a.expiryDate) - new Date(b.expiryDate)
        : a.code.localeCompare(b.code),
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <AdminLayout>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink">Coupons</h1>
          <p className="text-sm text-ink/50 mt-0.5">
            Create and manage discount codes
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-ink text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-ink/85 transition-colors whitespace-nowrap"
        >
          + Add Coupon
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Active Coupons
          </p>
          <p className="text-2xl font-semibold text-ink mt-1">{activeCount}</p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Expired / Inactive
          </p>
          <p className="text-2xl font-semibold text-ink mt-1">
            {expiredOrInactive}
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
            placeholder="Coupon code"
            required
            value={form.code}
            onChange={(e) =>
              setForm({ ...form, code: e.target.value.toUpperCase() })
            }
            className="w-full border border-ink/10 rounded-lg px-3 py-2 text-sm uppercase"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={form.discountType}
              onChange={(e) =>
                setForm({ ...form, discountType: e.target.value })
              }
              className="border border-ink/10 rounded-lg px-3 py-2 text-sm"
            >
              <option value="PERCENTAGE">Percentage</option>
              <option value="FIXED">Fixed</option>
            </select>
            <input
              type="number"
              placeholder="Discount value"
              required
              value={form.discount}
              onChange={(e) => setForm({ ...form, discount: e.target.value })}
              className="border border-ink/10 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <input
            type="number"
            placeholder="Min order amount"
            value={form.minimumOrderAmount}
            onChange={(e) =>
              setForm({ ...form, minimumOrderAmount: e.target.value })
            }
            className="w-full border border-ink/10 rounded-lg px-3 py-2 text-sm"
          />
          <input
            type="date"
            required
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
            className="w-full border border-ink/10 rounded-lg px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="bg-ink text-white px-4 py-2 rounded-lg text-sm"
            >
              Create
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
        <div className="flex flex-col lg:flex-row gap-3 p-4 border-b border-ink/10">
          <input
            type="text"
            placeholder="Search coupon code…"
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
              className="border border-ink/10 rounded-lg px-3 py-2 text-sm flex-1 lg:flex-none"
            >
              <option value="">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-ink/10 rounded-lg px-3 py-2 text-sm flex-1 lg:flex-none"
            >
              <option value="expiry">Sort by: Expiry</option>
              <option value="code">Sort by: Code</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !paginated.length ? (
          <p className="text-center py-16 text-ink/50">
            No coupons created yet.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="text-left text-ink/40 border-b border-ink/10 bg-cream/40 uppercase text-xs">
                    <th className="py-3 px-4">Coupon Code</th>
                    <th>Discount Type & Value</th>
                    <th>Min. Order</th>
                    <th>Expiry Date</th>
                    <th>Status</th>
                    <th className="pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((c) => {
                    const expired = isExpired(c);
                    return (
                      <tr
                        key={c._id}
                        className="border-b border-ink/5 hover:bg-cream/30"
                      >
                        <td className="py-3 px-4 font-mono font-medium text-accent">
                          {c.code}
                        </td>
                        <td>
                          <p className="font-medium text-ink">
                            {c.discountType === "PERCENTAGE"
                              ? `${c.discount}%`
                              : `₹${c.discount}`}
                          </p>
                          <p className="text-xs text-ink/40">
                            {c.discountType === "PERCENTAGE"
                              ? "Percentage off"
                              : "Fixed amount"}
                          </p>
                        </td>
                        <td>₹{c.minimumOrderAmount}</td>
                        <td>
                          {new Date(c.expiryDate).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </td>
                        <td>
                          <button
                            onClick={() => toggleStatus(c)}
                            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                              c.status === "Active" && !expired
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-ink/50"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${c.status === "Active" && !expired ? "bg-green-500" : "bg-gray-400"}`}
                            />
                            {expired ? "Expired" : c.status}
                          </button>
                        </td>
                        <td className="pr-4">
                          <button
                            onClick={() => setDeleteId(c._id)}
                            className="text-danger"
                          >
                            🗑
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-ink/10">
              <p className="text-sm text-ink/50">
                Showing {(page - 1) * PER_PAGE + 1}-
                {Math.min(page * PER_PAGE, filtered.length)} of{" "}
                {filtered.length} coupons
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
          message="Delete this coupon?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </AdminLayout>
  );
}
