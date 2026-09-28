import { createContext, useState, useEffect, useCallback } from "react";
import { adminLogin, getAdminProfile } from "../api/authApi";

export const AdminAuthContext = createContext(null);

export function AdminAuthProvider({ children }) {
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("admin_token"));
  const [loading, setLoading] = useState(true);

  const loadAdmin = useCallback(async () => {
    const saved = localStorage.getItem("admin_token");
    if (!saved) {
      setLoading(false);
      return;
    }
    try {
      const res = await getAdminProfile();
      setAdmin(res.data);
    } catch {
      localStorage.removeItem("admin_token");
      setToken(null);
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAdmin();
  }, [loadAdmin]);

  const login = async (credentials) => {
    const res = await adminLogin(credentials);
    localStorage.setItem("admin_token", res.token);
    setToken(res.token);
    await loadAdmin();
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setToken(null);
    setAdmin(null);
  };

  return (
    <AdminAuthContext.Provider value={{ admin, token, loading, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}
