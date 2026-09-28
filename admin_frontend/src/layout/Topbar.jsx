import { useNavigate, Link } from "react-router-dom";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function Topbar() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-ink/10 flex items-center justify-between px-6">
      <input
        type="text"
        placeholder="Search…"
        className="border border-ink/15 rounded px-3 py-1.5 text-sm w-64"
      />
      <div className="flex items-center gap-4">
        <Link to="/profile" className="text-sm text-ink/70">
          {admin?.username}
        </Link>
        <button onClick={handleLogout} className="text-sm text-danger">
          Logout
        </button>
      </div>
    </header>
  );
}
