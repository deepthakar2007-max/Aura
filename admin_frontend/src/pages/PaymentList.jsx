import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { getPayments } from "../api/paymentApi";

const statusColor = {
  success: "text-green-600",
  pending: "text-yellow-600",
  failed: "text-danger",
  refunded: "text-blue-600",
};

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPayments()
      .then((res) => setPayments(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold text-ink mb-5">Payments</h1>
      <div className="bg-white border border-ink/10 rounded overflow-x-auto">
        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/40 border-b border-ink/10">
                <th className="py-3 px-4">Transaction</th>
                <th>Customer</th>
                <th>Method</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((p) => (
                <tr key={p._id} className="border-b border-ink/5">
                  <td className="py-3 px-4">{p._id.slice(-8).toUpperCase()}</td>
                  <td>{p.user?.username}</td>
                  <td>{p.paymethod}</td>
                  <td>₹{p.amount}</td>
                  <td className={statusColor[p.paystatus]}>{p.paystatus}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
