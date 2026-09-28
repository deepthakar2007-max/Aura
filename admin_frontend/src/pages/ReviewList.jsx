import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import ConfirmModal from "../components/ConfirmModal";
import { getReviews, deleteReview } from "../api/reviewApi";

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [filter, setFilter] = useState("");

  const load = () => {
    setLoading(true);
    getReviews()
      .then((res) => setReviews(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async () => {
    await deleteReview(deleteId);
    setDeleteId(null);
    load();
  };

  const filtered = filter
    ? reviews.filter((r) => r.rating === Number(filter))
    : reviews;

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold text-ink mb-5">Reviews</h1>

      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="border border-ink/15 rounded px-3 py-2 text-sm mb-4"
      >
        <option value="">All Ratings</option>
        {[5, 4, 3, 2, 1].map((r) => (
          <option key={r} value={r}>
            {r} Star
          </option>
        ))}
      </select>

      <div className="bg-white border border-ink/10 rounded overflow-x-auto">
        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !filtered.length ? (
          <p className="p-6 text-ink/50">No reviews.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/40 border-b border-ink/10">
                <th className="py-3 px-4">Customer</th>
                <th>Product</th>
                <th>Rating</th>
                <th>Review</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r._id} className="border-b border-ink/5">
                  <td className="py-3 px-4">{r.user?.username}</td>
                  <td>{r.product?.name}</td>
                  <td>{"★".repeat(r.rating)}</td>
                  <td className="max-w-xs truncate">{r.review}</td>
                  <td>{new Date(r.createdAt).toLocaleDateString("en-IN")}</td>
                  <td>
                    <button
                      onClick={() => setDeleteId(r._id)}
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
          message="Delete this review?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </AdminLayout>
  );
}
