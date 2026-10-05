import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { getPayments } from "../api/paymentApi";

const PER_PAGE = 5;

const statusBadge = {
  success: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  failed: "bg-red-100 text-danger",
  refunded: "bg-blue-100 text-blue-700",
};

const methodLabel = { COD: "Cash on Delivery", UPI: "UPI" };

function toCSV(payments) {
  const headers = [
    "Transaction ID",
    "Customer",
    "Email",
    "Method",
    "Amount",
    "Status",
    "Date",
  ];
  const rows = payments.map((p) => [
    p._id,
    p.user?.username || "",
    p.user?.email || "",
    p.paymethod,
    p.amount,
    p.paystatus,
    new Date(p.createdAt).toLocaleDateString("en-IN"),
  ]);
  return [headers, ...rows]
    .map((r) => r.map((v) => `"${v}"`).join(","))
    .join("\n");
}

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [methodFilter, setMethodFilter] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    getPayments()
      .then((res) => setPayments(res.data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = payments.filter((p) => {
    const matchesSearch =
      p._id.toLowerCase().includes(search.toLowerCase()) ||
      p.user?.username?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || p.paystatus === statusFilter;
    const matchesMethod = !methodFilter || p.paymethod === methodFilter;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const successCount = payments.filter((p) => p.paystatus === "success").length;
  const pendingCount = payments.filter((p) => p.paystatus === "pending").length;
  const failedCount = payments.filter((p) => p.paystatus === "failed").length;

  const handleExport = () => {
    const blob = new Blob([toCSV(filtered)], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "payments.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <AdminLayout>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink">Payments</h1>
          <p className="text-sm text-ink/50 mt-0.5">
            View and track all transaction records
          </p>
        </div>
        <button
          onClick={handleExport}
          className="border border-ink/10 rounded-lg px-4 py-2 text-sm text-ink hover:bg-cream/40 transition-colors whitespace-nowrap"
        >
          ↓ Export CSV
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-sm text-ink/50">Total Transactions</p>
          <p className="text-2xl font-semibold text-ink mt-1">
            {payments.length}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-sm text-ink/50">Successful Payments</p>
          <p className="text-2xl font-semibold text-green-600 mt-1">
            {successCount}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-sm text-ink/50">Pending Payments</p>
          <p className="text-2xl font-semibold text-amber-600 mt-1">
            {pendingCount}
          </p>
        </div>
        <div className="bg-white border border-ink/10 rounded-xl p-4">
          <p className="text-sm text-ink/50">Failed Payments</p>
          <p className="text-2xl font-semibold text-danger mt-1">
            {failedCount}
          </p>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-xl overflow-hidden">
        <div className="flex flex-col lg:flex-row gap-3 p-4 border-b border-ink/10">
          <input
            type="text"
            placeholder="Search by transaction ID or customer…"
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
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
            </select>
            <select
              value={methodFilter}
              onChange={(e) => {
                setMethodFilter(e.target.value);
                setPage(1);
              }}
              className="border border-ink/10 rounded-lg px-3 py-2 text-sm flex-1 lg:flex-none"
            >
              <option value="">Payment Method: All</option>
              <option value="COD">Cash on Delivery</option>
              <option value="UPI">UPI</option>
            </select>
          </div>
        </div>

        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !paginated.length ? (
          <p className="text-center py-16 text-ink/50">
            No transactions found.
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="text-left text-ink/40 border-b border-ink/10 bg-cream/40 uppercase text-xs">
                    <th className="py-3 px-4">Transaction ID</th>
                    <th>Customer</th>
                    <th>Payment Method</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th className="pr-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((p) => (
                    <tr
                      key={p._id}
                      className="border-b border-ink/5 hover:bg-cream/30"
                    >
                      <td className="py-3 px-4 font-mono font-medium text-accent">
                        #{p._id.slice(-6).toUpperCase()}
                      </td>
                      <td>
                        <p className="text-ink">
                          {p.user?.username || "Unknown"}
                        </p>
                        <p className="text-xs text-ink/40">
                          {p.user?.email || "—"}
                        </p>
                      </td>
                      <td className="text-ink/70">
                        {methodLabel[p.paymethod] || p.paymethod}
                      </td>
                      <td className="font-medium">₹{p.amount}</td>
                      <td>
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${statusBadge[p.paystatus] || "bg-gray-100 text-ink/50"}`}
                        >
                          {p.paystatus}
                        </span>
                      </td>
                      <td className="pr-4 text-ink/60">
                        {new Date(p.createdAt).toLocaleDateString("en-IN")}
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
                {filtered.length} results
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
