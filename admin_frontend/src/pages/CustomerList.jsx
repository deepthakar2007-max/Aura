import { useEffect, useMemo, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { getCustomers } from "../api/customerApi";

const PER_PAGE = 8;

const safe = (v) => String(v ?? "").toLowerCase();

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [copiedId, setCopiedId] = useState("");

  useEffect(() => {
    getCustomers()
      .then((res) => setCustomers(Array.isArray(res.data) ? res.data : []))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = safe(search).trim();
    if (!q) return customers;
    return customers.filter(
      (c) =>
        safe(c.username).includes(q) ||
        safe(c.email).includes(q) ||
        safe(c._id).includes(q),
    );
  }, [customers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 1500);
  };

  const initials = (name) =>
    name
      ? String(name)
          .split(" ")
          .map((n) => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase()
      : "?";

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-ink">Customers</h1>
        <p className="text-sm text-ink/50 mt-0.5">
          All registered store customers
        </p>
      </div>

      <div className="bg-white border border-ink/10 rounded-xl p-4 mb-6 w-fit">
        <p className="text-xs uppercase tracking-wide text-ink/40">
          Total Customers
        </p>
        <p className="text-2xl font-semibold text-ink mt-1">
          {customers.length}
        </p>
      </div>

      <div className="bg-white border border-ink/10 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-ink/10">
          <input
            type="text"
            placeholder="Search by name, email or ID…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full sm:w-80 border border-ink/10 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30"
          />
        </div>

        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : error ? (
          <p className="p-6 text-danger">{error}</p>
        ) : !paginated.length ? (
          <p className="text-center py-16 text-ink/50">No customers found.</p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="text-left text-ink/40 border-b border-ink/10 bg-cream/40 uppercase text-xs">
                    <th className="py-3 px-4">Customer</th>
                    <th>User ID</th>
                    <th>Phone</th>
                    <th className="pr-4">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((c) => (
                    <tr
                      key={c._id}
                      className="border-b border-ink/5 hover:bg-cream/30"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <span className="w-9 h-9 rounded-full bg-accent/15 text-accent text-xs flex items-center justify-center flex-shrink-0 overflow-hidden">
                            {c.photo ? (
                              <img
                                src={c.photo}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              initials(c.username)
                            )}
                          </span>
                          <div className="min-w-0">
                            <p className="text-ink truncate">
                              {c.username || "Unnamed user"}
                            </p>
                            <p className="text-xs text-ink/40 truncate">
                              {c.email || "—"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <button
                          onClick={() => handleCopy(c._id)}
                          className="text-xs text-accent underline font-mono"
                        >
                          {copiedId === c._id
                            ? "Copied ✅"
                            : String(c._id).slice(-8).toUpperCase()}
                        </button>
                      </td>
                      <td className="text-ink/60">{c.phone || "—"}</td>
                      <td className="pr-4 text-ink/60">
                        {c.createdAt
                          ? new Date(c.createdAt).toLocaleDateString("en-IN")
                          : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4 border-t border-ink/10">
              <p className="text-sm text-ink/50">
                Showing {(page - 1) * PER_PAGE + 1}–
                {Math.min(page * PER_PAGE, filtered.length)} of{" "}
                {filtered.length} customers
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
