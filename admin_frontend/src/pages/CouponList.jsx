import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import ConfirmModal from "../components/ConfirmModal";
import {
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from "../api/couponApi";

export default function CouponList() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
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

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold text-ink">Coupons</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-ink text-white px-4 py-2 rounded text-sm"
        >
          + Add Coupon
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white border border-ink/10 rounded p-5 mb-5 max-w-md space-y-3"
        >
          {error && <p className="text-sm text-danger">{error}</p>}
          <input
            placeholder="Code"
            required
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Discount"
            required
            value={form.discount}
            onChange={(e) => setForm({ ...form, discount: e.target.value })}
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
          <select
            value={form.discountType}
            onChange={(e) => setForm({ ...form, discountType: e.target.value })}
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          >
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED">Fixed</option>
          </select>
          <input
            type="number"
            placeholder="Min Order Amount"
            value={form.minimumOrderAmount}
            onChange={(e) =>
              setForm({ ...form, minimumOrderAmount: e.target.value })
            }
            className="w-full border border-ink/15 rounded px-3 py-2 text-sm"
          />
          <input
            type="date"
            required
            value={form.expiryDate}
            onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
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
                <th className="py-3 px-4">Code</th>
                <th>Discount</th>
                <th>Min Order</th>
                <th>Expiry</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((c) => (
                <tr key={c._id} className="border-b border-ink/5">
                  <td className="py-3 px-4">{c.code}</td>
                  <td>
                    {c.discountType === "PERCENTAGE"
                      ? `${c.discount}%`
                      : `₹${c.discount}`}
                  </td>
                  <td>₹{c.minimumOrderAmount}</td>
                  <td>{new Date(c.expiryDate).toLocaleDateString("en-IN")}</td>
                  <td>
                    <button
                      onClick={() => toggleStatus(c)}
                      className={
                        c.status === "Active" ? "text-green-600" : "text-ink/40"
                      }
                    >
                      {c.status}
                    </button>
                  </td>
                  <td>
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
          message="Delete this coupon?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </AdminLayout>
  );
}
