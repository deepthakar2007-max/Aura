import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { getReturns, updateReturnStatus } from "../api/returnApi";

const PER_PAGE = 5;
const STATUSES = [
  "Requested",
  "Approved",
  "Rejected",
  "Product Received",
  "Refund Processed",
  "Completed",
];

const statusBadge = {
  Requested: "bg-amber-100 text-amber-700",
  Approved: "bg-blue-100 text-blue-700",
  Rejected: "bg-red-100 text-danger",
  "Product Received": "bg-indigo-100 text-indigo-700",
  "Refund Processed": "bg-purple-100 text-purple-700",
  Completed: "bg-green-100 text-green-700",
};

export default function ReturnList() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = () => {
    setLoading(true);
    getReturns()
      .then((res) => setReturns(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleChange = async (id, status) => {
    await updateReturnStatus(id, status);
    load();
  };

  const counts = STATUSES.reduce((acc, s) => {
    acc[s] = returns.filter((r) => r.status === s).length;
    return acc;
  }, {});

  const filtered = returns
    .filter((r) => tab === "All" || r.status === tab)
    .filter(
      (r) =>
        r.user?.username?.toLowerCase().includes(search.toLowerCase()) ||
        r.order?._id?.toLowerCase().includes(search.toLowerCase()),
    );

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">Returns & Refunds</h1>
        <p className="text-sm text-ink/50 mt-0.5">
          Manage customer return requests and refund processing
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-sm text-ink/50">Total Requests</p>
          <p className="text-2xl font-semibold text-ink mt-1">
            {returns.length}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-sm text-ink/50">Pending Review</p>
          <p className="text-2xl font-semibold text-amber-600 mt-1">
            {counts.Requested}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-sm text-ink/50">Approved</p>
          <p className="text-2xl font-semibold text-blue-600 mt-1">
            {counts.Approved}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-sm text-ink/50">Completed</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {counts.Completed}
          </p>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-3 p-4 border-b border-ink/10">
          <div className="flex gap-2 flex-wrap overflow-x-auto">
            <button
              onClick={() => {
                setTab("All");
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap flex items-center gap-1.5 ${tab === "All" ? "bg-ink text-white" : "bg-cream/60 text-ink/60"}`}
            >
              All <span className="text-xs">{returns.length}</span>
            </button>
            {STATUSES.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setTab(s);
                  setPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-sm whitespace-nowrap flex items-center gap-1.5 ${tab === s ? "bg-ink text-white" : "bg-cream/60 text-ink/60"}`}
              >
                {s} <span className="text-xs">{counts[s]}</span>
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Search orders or customers…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 border border-ink/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !paginated.length ? (
          <p className="text-center py-16 text-ink/50">
            No return requests {tab !== "All" && `in "${tab}"`} yet.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="text-left text-ink/40 border-b border-ink/10 bg-cream/40 uppercase text-xs">
                    <th className="py-3 px-4">Order ID</th>
                    <th>Customer</th>
                    <th>Return Reason</th>
                    <th>Status</th>
                    <th className="pr-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((r) => (
                    <tr
                      key={r._id}
                      className="border-b border-ink/5 hover:bg-cream/30"
                    >
                      <td className="py-3 px-4 font-medium text-accent">
                        #{r.order?._id?.slice(-6).toUpperCase() || "—"}
                      </td>
                      <td>
                        <p className="text-ink">
                          {r.user?.username || "Unknown"}
                        </p>
                        <p className="text-xs text-ink/40">
                          {r.user?.email || "—"}
                        </p>
                      </td>
                      <td className="text-ink/60 max-w-[220px] truncate">
                        {r.reason}
                      </td>
                      <td>
                        <select
                          value={r.status}
                          onChange={(e) => handleChange(r._id, e.target.value)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg font-medium border-none outline-none cursor-pointer ${statusBadge[r.status]}`}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="pr-4 text-ink/60">
                        {new Date(r.createdAt).toLocaleDateString("en-IN")}
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
                {filtered.length} requests
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
    </AdminLayout>
  );
}
