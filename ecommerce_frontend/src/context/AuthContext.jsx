import { createContext, useState, useEffect, useCallback, useRef } from "react";
import { loginUser, registerUser, fetchCurrentUser } from "../api/authApi";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);
  const retries = useRef(0);

  const loadUser = useCallback(async () => {
    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetchCurrentUser();
      retries.current = 0;
      setUser(res.data);
    } catch (err) {
      if ([401, 403, 404].includes(err.status)) {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      } else if (retries.current < 5) {
        retries.current += 1;
        setTimeout(loadUser, 5000);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (credentials) => {
    const res = await loginUser(credentials);
    localStorage.setItem("token", res.token);
    setToken(res.token);
    await loadUser();
    return res;
  };

  const register = (payload) => registerUser(payload);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const res = await fetchCurrentUser();
    setUser(res.data);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, register, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
