import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/products", label: "Products" },
  { to: "/categories", label: "Categories" },
  { to: "/brands", label: "Brands" },
  { to: "/inventory", label: "Inventory" },
  { to: "/orders", label: "Orders" },
  { to: "/customers", label: "Customers" },
  { to: "/coupons", label: "Coupons" },
  { to: "/payments", label: "Payments" },
  { to: "/returns", label: "Returns & Refunds" },
  { to: "/reviews", label: "Reviews" },
  { to: "/analytics", label: "Analytics" },
  { to: "/reports", label: "Reports" },
  { to: "/notifications", label: "Notifications" },
  { to: "/banners", label: "Banners / CMS" },
  { to: "/admin-users", label: "Admin Users" },
  { to: "/activity-logs", label: "Activity Logs" },
  { to: "/settings", label: "Settings" },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}
      <aside
        className={`fixed md:static top-0 left-0 h-full md:h-auto w-64 md:w-56 bg-ink text-white flex-shrink-0 min-h-screen p-4 overflow-y-auto z-50 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-8 px-2">
          <p className="text-lg font-semibold">AURA Admin</p>
          <button onClick={onClose} className="md:hidden text-white/60">
            ✕
          </button>
        </div>
        <nav className="space-y-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded text-sm ${isActive ? "bg-white/10" : "text-white/60 hover:bg-white/5"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
