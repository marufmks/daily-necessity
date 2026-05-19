import { createContext, useCallback, useEffect, useState } from "react";
import { authApi } from "../api/endpoints";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      authApi
        .me()
        .then(setUser)
        .catch(() => localStorage.removeItem("token"))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (data) => {
    const result = await authApi.login(data);
    localStorage.setItem("token", result.accessToken);
    if (result.refreshToken) localStorage.setItem("refreshToken", result.refreshToken);
    setUser(result.user);
    return result;
  }, []);

  const register = useCallback(async (data) => {
    const result = await authApi.register(data);
    return result;
  }, []);

  const logout = useCallback(async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await authApi.logout(refreshToken);
      } catch { /* ignore */ }
    }
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
