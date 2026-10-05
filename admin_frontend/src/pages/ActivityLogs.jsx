import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { getActivityLogs } from "../api/activityLogApi";

const PER_PAGE = 6;

const moduleBadge = {
  Auth: "bg-blue-100 text-blue-700",
  Products: "bg-purple-100 text-purple-700",
  Orders: "bg-amber-100 text-amber-700",
  Settings: "bg-gray-100 text-ink/60",
  CMS: "bg-green-100 text-green-700",
};

function toCSV(logs) {
  const headers = ["Admin", "Action", "Module", "Date"];
  const rows = logs.map((l) => [
    l.admin?.username || "",
    l.action,
    l.module,
    new Date(l.createdAt).toLocaleString("en-IN"),
  ]);
  return [headers, ...rows]
    .map((r) => r.map((v) => `"${v}"`).join(","))
    .join("\n");
}

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [moduleFilter, setModuleFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getActivityLogs()
      .then((res) => setLogs(res.data))
      .finally(() => setLoading(false));
  }, []);

  const modules = [...new Set(logs.map((l) => l.module))];

  const filtered = logs
    .filter(
      (l) =>
        l.admin?.username?.toLowerCase().includes(search.toLowerCase()) ||
        l.action.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((l) => !moduleFilter || l.module === moduleFilter);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const initials = (name) =>
    name
      ? name
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "?";

  const handleExport = () => {
    const blob = new Blob([toCSV(filtered)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "activity_logs.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <p className="text-xs text-accent uppercase tracking-wide mb-1">
        Security & Compliance
      </p>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-1">
        <h1 className="text-2xl font-semibold text-ink">Activity Logs</h1>
        <button
          onClick={handleExport}
          className="border border-ink/10 rounded-lg px-4 py-2 text-sm text-ink hover:bg-cream/40 transition-colors whitespace-nowrap"
        >
          ↓ Export Audit Log
        </button>
      </div>
      <p className="text-sm text-ink/50 mb-6">
        Audit trail of all administrative actions.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Total Logged Events
          </p>
          <p className="text-2xl font-semibold text-ink mt-1">{logs.length}</p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-xs uppercase tracking-wide text-ink/40">
            Active Admins Logged
          </p>
          <p className="text-2xl font-semibold text-ink mt-1">
            {new Set(logs.map((l) => l.admin?._id)).size}
          </p>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-3 p-4 border-b border-ink/10">
          <input
            type="text"
            placeholder="Search by admin name or action…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="flex-1 border border-ink/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30"
          />
          <select
            value={moduleFilter}
            onChange={(e) => {
              setModuleFilter(e.target.value);
              setPage(1);
            }}
            className="border border-ink/10 rounded-lg px-3 py-2 text-sm"
          >
            <option value="">All Modules</option>
            {modules.map((m) => (
              <option key={m}>{m}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !paginated.length ? (
          <p className="text-center py-16 text-ink/50">
            No activity recorded yet.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="text-left text-ink/40 border-b border-ink/10 bg-cream/40 uppercase text-xs">
                    <th className="py-3 px-4">Admin User</th>
                    <th>Action</th>
                    <th>Module</th>
                    <th className="pr-4">Date & Time</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((l) => (
                    <tr
                      key={l._id}
                      className="border-b border-ink/5 hover:bg-cream/30"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-accent/15 text-accent text-xs flex items-center justify-center flex-shrink-0">
                            {initials(l.admin?.username)}
                          </span>
                          <p className="text-ink truncate">
                            {l.admin?.username || "Unknown"}
                          </p>
                        </div>
                      </td>
                      <td className="text-ink">{l.action}</td>
                      <td>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${moduleBadge[l.module] || "bg-gray-100 text-ink/60"}`}
                        >
                          {l.module}
                        </span>
                      </td>
                      <td className="pr-4 text-ink/60">
                        {new Date(l.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                        <span className="text-xs text-ink/40 block">
                          {new Date(l.createdAt).toLocaleTimeString("en-IN")}
                        </span>
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
                {filtered.length} logs
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
    </AdminLayout>
  );
}
