import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { getReturns, updateReturnStatus } from "../api/returnApi";

const STATUSES = [
  "Requested",
  "Approved",
  "Rejected",
  "Product Received",
  "Refund Processed",
  "Completed",
];

export default function ReturnList() {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold text-ink mb-5">Returns & Refunds</h1>
      <div className="bg-white border border-ink/10 rounded overflow-x-auto">
        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !returns.length ? (
          <p className="p-6 text-ink/50">No return requests.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/40 border-b border-ink/10">
                <th className="py-3 px-4">Order</th>
                <th>Customer</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {returns.map((r) => (
                <tr key={r._id} className="border-b border-ink/5">
                  <td className="py-3 px-4">
                    #{r.order?._id.slice(-6).toUpperCase()}
                  </td>
                  <td>{r.user?.username}</td>
                  <td>{r.reason}</td>
                  <td>
                    <select
                      value={r.status}
                      onChange={(e) => handleChange(r._id, e.target.value)}
                      className="border border-ink/15 rounded px-2 py-1 text-xs"
                    >
                      {STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
