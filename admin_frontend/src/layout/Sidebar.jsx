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

export default function Sidebar() {
  return (
    <aside className="w-56 bg-ink text-white flex-shrink-0 min-h-screen p-4 overflow-y-auto">
      <p className="text-lg font-semibold mb-8 px-2">AURA Admin</p>
      <nav className="space-y-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `block px-3 py-2 rounded text-sm ${isActive ? "bg-white/10" : "text-white/60 hover:bg-white/5"}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
