import { Navigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const { user, loading, token } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink/50 font-display italic">
        loading…
      </div>
    );
  }
  if (!token || !user) return <Navigate to="/login" replace />;
  return children;
}
