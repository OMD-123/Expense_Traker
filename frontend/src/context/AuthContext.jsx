import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("expense-tracker-token"));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((response) => setUser(response.data.user))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, [token]);

  function login(payload) {
    setToken(payload.token);
    setUser(payload.user);
    localStorage.setItem("expense-tracker-token", payload.token);
  }

  function logout() {
    setToken(null);
    setUser(null);
    setLoading(false);
    localStorage.removeItem("expense-tracker-token");
  }

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
