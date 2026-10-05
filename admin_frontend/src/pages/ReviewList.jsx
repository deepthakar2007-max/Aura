import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import ConfirmModal from "../components/ConfirmModal";
import { getReviews, deleteReview } from "../api/reviewApi";

const PER_PAGE = 5;

function toCSV(reviews) {
  const headers = ["Customer", "Product", "Rating", "Review", "Date"];
  const rows = reviews.map((r) => [
    r.user?.username || "",
    r.product?.name || "",
    r.rating,
    r.review || "",
    new Date(r.createdAt).toLocaleDateString("en-IN"),
  ]);
  return [headers, ...rows]
    .map((r) => r.map((v) => `"${v}"`).join(","))
    .join("\n");
}

export default function ReviewList() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ratingFilter, setRatingFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);

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

  const handleExport = () => {
    const blob = new Blob([toCSV(filtered)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reviews.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = reviews
    .filter((r) => !ratingFilter || r.rating === Number(ratingFilter))
    .sort((a, b) =>
      sortBy === "newest"
        ? new Date(b.createdAt) - new Date(a.createdAt)
        : new Date(a.createdAt) - new Date(b.createdAt),
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const avgRating = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";
  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const lowRatingCount = reviews.filter((r) => r.rating <= 2).length;

  const initials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "?";

  return (
    <AdminLayout>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink">Reviews</h1>
          <p className="text-sm text-ink/50 mt-0.5">
            Monitor customer feedback and product ratings
          </p>
        </div>
        <button
          onClick={handleExport}
          className="border border-ink/10 rounded-lg px-4 py-2 text-sm text-ink hover:bg-cream/40 transition-colors whitespace-nowrap"
        >
          ↓ Export Reviews
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-sm text-ink/50">Total Reviews</p>
          <p className="text-2xl font-semibold text-ink mt-1">
            {reviews.length}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-sm text-ink/50">Average Rating</p>
          <p className="text-2xl font-semibold text-ink mt-1">{avgRating} ★</p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-sm text-ink/50">5-Star Count</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {fiveStarCount}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-sm text-ink/50">1-2 Star Count</p>
          <p className="text-2xl font-semibold text-danger mt-1">
            {lowRatingCount}
          </p>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-xl overflow-hidden">
        <div className="flex flex-col sm:flex-row gap-2 p-4 border-b border-ink/10">
          <select
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value);
              setPage(1);
            }}
            className="border border-ink/10 rounded-lg px-3 py-2 text-sm flex-1 sm:flex-none"
          >
            <option value="">All Ratings</option>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {r} Star
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-ink/10 rounded-lg px-3 py-2 text-sm flex-1 sm:flex-none"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Sort by: Oldest</option>
          </select>
          <p className="text-sm text-ink/40 flex items-center sm:ml-auto">
            Showing {filtered.length} reviews
          </p>
        </div>

        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !paginated.length ? (
          <p className="text-center py-16 text-ink/50">No reviews yet.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="text-left text-ink/40 border-b border-ink/10 bg-cream/40 uppercase text-xs">
                    <th className="py-3 px-4">Customer</th>
                    <th>Product</th>
                    <th>Rating</th>
                    <th>Review Text</th>
                    <th>Date</th>
                    <th className="pr-4">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((r) => (
                    <tr
                      key={r._id}
                      className="border-b border-ink/5 hover:bg-cream/30"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-accent/15 text-accent text-xs flex items-center justify-center flex-shrink-0">
                            {initials(r.user?.username)}
                          </span>
                          <p className="text-ink truncate">
                            {r.user?.username || "Anonymous"}
                          </p>
                        </div>
                      </td>
                      <td className="text-ink/70">{r.product?.name || "—"}</td>
                      <td className="text-accent">
                        {"★".repeat(r.rating)}
                        {"☆".repeat(5 - r.rating)}
                      </td>
                      <td className="text-ink/60 max-w-[260px] truncate">
                        {r.review || "—"}
                      </td>
                      <td className="text-ink/60">
                        {new Date(r.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="pr-4">
                        <button
                          onClick={() => setDeleteId(r._id)}
                          className="text-danger"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-ink/10">
              <p className="text-sm text-ink/50">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg border border-ink/10 text-sm disabled:opacity-40"
                >
                  Previous
                </button>
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
          message="Delete this review?"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </AdminLayout>
  );
}
