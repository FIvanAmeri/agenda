import { useState, useEffect } from "react";
import { User, AuthResponse, AuthContextType } from "../components/interfaz/interfaz";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/users";

export default function useAuth(): AuthContextType {
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== "undefined") return localStorage.getItem("token");
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }
    const storedToken = localStorage.getItem("token");
    if (storedToken) setToken(storedToken);
    setLoading(false);
  }, []);

  const login = async (credentials: Pick<User, "usuario" | "contrasena">): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error en el inicio de sesión");
      if (data.user && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(data.token);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (payload: Pick<User, "usuario" | "email" | "contrasena">): Promise<void> => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data: AuthResponse = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
  };

  return { login, register, logout, token, loading };
}
