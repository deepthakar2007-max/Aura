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
    <header className="h-16 bg-white border-b border-ink/10 flex items-center justify-between px-4 sm:px-6 gap-3">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button
          onClick={onMenuClick}
          className="md:hidden text-ink text-xl flex-shrink-0"
        >
          ☰
        </button>
        <input
          type="text"
          placeholder="Search…"
          className="border border-ink/15 rounded px-3 py-1.5 text-sm w-full max-w-xs hidden sm:block"
        />
      </div>
      <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
        <Link
          to="/profile"
          className="text-sm text-ink/70 truncate max-w-[100px] sm:max-w-none"
        >
          {admin?.username}
        </Link>
        <button onClick={handleLogout} className="text-sm text-danger">
          Logout
        </button>
      </div>
    </header>
  );
}
