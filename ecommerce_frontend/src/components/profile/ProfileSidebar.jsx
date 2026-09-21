import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function ProfileSidebar() {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to: "/profile", label: "Profile", icon: "👤" },
    { to: "/orders", label: "My Orders", icon: "📦" },
    { to: "/wishlist", label: "Wishlist", icon: "♡" },
    { to: "/addresses", label: "Saved Addresses", icon: "📍" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-full md:w-56 flex-shrink-0 bg-white border border-ink/10 p-3 h-fit">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded-lg transition-colors ${
            pathname === link.to
              ? "bg-cream text-ink font-medium"
              : "text-ink/60 hover:bg-cream/60"
          }`}
        >
          <span>{link.icon}</span>
          {link.label}
        </Link>
      ))}
      <button
        onClick={handleLogout}
        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 rounded-lg transition-colors mt-2 border-t border-ink/10 pt-4"
      >
        <span>↪</span>Logout
      </button>
    </aside>
  );
}
