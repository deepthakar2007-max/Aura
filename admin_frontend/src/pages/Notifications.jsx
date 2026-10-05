import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../layout/AdminLayout";
import { getNotifications, markAllRead } from "../api/notificationApi";
import apiClient from "../api/apiClient";

const PER_PAGE = 6;

const typeConfig = {
  order: { icon: "🛒", action: "View Order", route: "/orders" },
  customer: { icon: "👤", action: "View Customer", route: "/customers" },
  stock: { icon: "⚠️", action: "View Inventory", route: "/inventory" },
  review: { icon: "⭐", action: "Moderate Review", route: "/reviews" },
  return: { icon: "↩️", action: "View Returns", route: "/returns" },
  payment: { icon: "💳", action: "View Payments", route: "/payments" },
};

function timeAgo(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [page, setPage] = useState(1);

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

  const handleMarkOne = async (id) => {
    await apiClient.put(`/admin/notifications/${id}/read`, {}, { auth: true });
    load();
  };

  const filtered =
    filter === "unread" ? notifications.filter((n) => !n.read) : notifications;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <AdminLayout>
      <div className="flex items-start justify-between flex-wrap gap-3 mb-6">
        <div>
          <h1 className="text-xl font-semibold text-ink">Notifications</h1>
          <p className="text-sm text-ink/50 mt-0.5">
            Stay updated on store activity
          </p>
        </div>
        <div className="flex gap-2 items-center">
          <button
            onClick={handleMarkAll}
            className="text-sm text-accent whitespace-nowrap"
          >
            ✓ Mark all as read
          </button>
          <div className="flex bg-cream/60 rounded-lg p-1">
            <button
              onClick={() => {
                setFilter("all");
                setPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-sm ${filter === "all" ? "bg-white shadow-sm" : "text-ink/50"}`}
            >
              All
            </button>
            <button
              onClick={() => {
                setFilter("unread");
                setPage(1);
              }}
              className={`px-3 py-1 rounded-lg text-sm ${filter === "unread" ? "bg-white shadow-sm" : "text-ink/50"}`}
            >
              Unread
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <p className="text-ink/50">Loading…</p>
      ) : !paginated.length ? (
        <div className="bg-white border border-ink/10 rounded-xl p-16 text-center">
          <p className="text-3xl mb-2">🔔</p>
          <p className="text-ink/50">No notifications yet.</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {paginated.map((n) => {
              const cfg = typeConfig[n.type] || {
                icon: "🔔",
                action: "View",
                route: "/dashboard",
              };
              return (
                <div
                  key={n._id}
                  className={`rounded-xl p-5 border ${n.read ? "bg-white border-ink/10" : "bg-cream/50 border-accent/20"}`}
                >
                  <div className="flex gap-4">
                    <span className="w-10 h-10 rounded-lg bg-white flex items-center justify-center text-lg flex-shrink-0 border border-ink/10">
                      {cfg.icon}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <p className="font-medium text-ink flex items-center gap-2">
                          {!n.read && (
                            <span className="w-1.5 h-1.5 rounded-full bg-accent flex-shrink-0" />
                          )}
                          {n.message.split(":")[0] || "Notification"}
                        </p>
                        <span className="text-xs text-ink/40 whitespace-nowrap">
                          {timeAgo(n.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm text-ink/60 mt-1">{n.message}</p>
                      <div className="flex gap-4 mt-3">
                        <button
                          onClick={() => navigate(cfg.route)}
                          className="bg-ink text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                        >
                          {cfg.action}
                        </button>
                        {!n.read && (
                          <button
                            onClick={() => handleMarkOne(n._id)}
                            className="text-ink/40 text-xs"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-5">
            <p className="text-sm text-ink/50">
              Showing {paginated.length} of {filtered.length} notifications
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
    </AdminLayout>
  );
}
