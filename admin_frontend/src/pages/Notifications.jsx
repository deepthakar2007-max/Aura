import { useEffect, useState } from "react";
import AdminLayout from "../layout/AdminLayout";
import { getNotifications, markAllRead } from "../api/notificationApi";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    getNotifications()
      .then((res) => setNotifications(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleMarkAll = async () => {
    await markAllRead();
    load();
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-5">
        <h1 className="text-xl font-semibold text-ink">Notifications</h1>
        <button onClick={handleMarkAll} className="text-sm text-accent">
          Mark all as read
        </button>
      </div>
      <div className="bg-white border border-ink/10 rounded">
        {loading ? (
          <p className="p-6 text-ink/50">Loading…</p>
        ) : !notifications.length ? (
          <p className="p-6 text-ink/50">No notifications yet.</p>
        ) : (
          notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 border-b border-ink/5 text-sm ${!n.read ? "bg-cream/40" : ""}`}
            >
              <p>{n.message}</p>
              <p className="text-xs text-ink/40 mt-1">
                {new Date(n.createdAt).toLocaleString("en-IN")}
              </p>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
