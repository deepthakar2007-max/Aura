import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { getCustomers } from "../api/customerApi";

export default function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [copiedId, setCopiedId] = useState("");

  useEffect(() => {
    getCustomers()
      .then((res) => setCustomers(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleCopy = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(""), 1500);
  };

  const filtered = customers.filter((c) =>
    c.username.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold text-ink mb-5">Customers</h1>
      <input
        type="text"
        placeholder="Search customers…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="border border-ink/15 rounded px-3 py-2 text-sm w-64 mb-4"
      />
      <div className="bg-white border border-ink/10 rounded overflow-x-auto">
        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/40 border-b border-ink/10">
                <th className="py-3 px-4">User ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((c) => (
                <tr key={c._id} className="border-b border-ink/5">
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleCopy(c._id)}
                      className="text-xs text-accent underline"
                    >
                      {copiedId === c._id
                        ? "Copied ✅"
                        : c._id.slice(-8).toUpperCase()}
                    </button>
                  </td>
                  <td>{c.username}</td>
                  <td>{c.email}</td>
                  <td>{new Date(c.createdAt).toLocaleDateString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
