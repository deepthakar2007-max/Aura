import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function Topbar({ onMenuClick }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 h-16 bg-white border-b border-ink/10 flex items-center justify-between px-4 sm:px-6 gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden text-ink text-xl flex-shrink-0"
        >
          ☰
        </button>
        <div className="relative w-full max-w-sm hidden sm:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/30 text-sm">
            ⌕
          </span>
          <input
            type="text"
            placeholder="Search anything…"
            className="w-full bg-cream/60 border border-ink/10 rounded-lg pl-9 pr-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent"
          />
        </div>
      </div>
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        <button className="relative text-ink/60 text-lg">
          🔔
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-danger rounded-full" />
        </button>
        <Link to="/profile" className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm">
            {admin?.username?.[0]?.toUpperCase() || "A"}
          </span>
          <span className="text-sm text-ink/70 hidden sm:inline truncate max-w-[100px]">
            {admin?.username}
          </span>
        </Link>
        <button onClick={handleLogout} className="text-sm text-danger">
          Logout
        </button>
      </div>
    </header>
  );
}
