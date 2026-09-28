import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { getActivityLogs } from "../api/activityLogApi";

export default function ActivityLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getActivityLogs()
      .then((res) => setLogs(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-xl font-semibold text-ink mb-5">Activity Logs</h1>
      <div className="bg-white border border-ink/10 rounded overflow-x-auto">
        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !logs.length ? (
          <p className="p-6 text-ink/50">No activity yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-ink/40 border-b border-ink/10">
                <th className="py-3 px-4">Admin</th>
                <th>Action</th>
                <th>Module</th>
                <th>Date</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l._id} className="border-b border-ink/5">
                  <td className="py-3 px-4">{l.admin?.username}</td>
                  <td>{l.action}</td>
                  <td>{l.module}</td>
                  <td>{new Date(l.createdAt).toLocaleDateString("en-IN")}</td>
                  <td>{new Date(l.createdAt).toLocaleTimeString("en-IN")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
