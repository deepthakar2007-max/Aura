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
        className={`fixed md:sticky top-0 left-0 h-screen w-64 md:w-56 bg-sidebar text-white flex-shrink-0 overflow-y-auto z-50 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-md bg-accent/20 text-accent flex items-center justify-center text-sm">
              A
            </span>
            <p className="text-sm font-semibold tracking-wide">AURA</p>
          </div>
          <button onClick={onClose} className="md:hidden text-white/50">
            ✕
          </button>
        </div>
        <nav className="p-3 space-y-0.5">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              onClick={onClose}
              className={({ isActive }) =>
                `block px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive
                    ? "bg-accent/15 text-accent"
                    : "text-white/55 hover:bg-white/5 hover:text-white/80"
                }`
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
