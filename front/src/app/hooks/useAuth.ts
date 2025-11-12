import { useState, useEffect } from "react";
import { User, AuthResponse, AuthContextType } from "../components/interfaz/interfaz";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/users";

export default function useAuth(): AuthContextType {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  const login = async (credentials: Pick<User, "usuario" | "contrasena">): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      });

      const data: AuthResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en el inicio de sesión.");
      }

      if (data.user) {
        const fakeToken = btoa(`${data.user.usuario}:${Date.now()}`);
        localStorage.setItem("token", fakeToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        setToken(fakeToken);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: Pick<User, "usuario" | "email" | "contrasena">): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result: AuthResponse = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al registrar usuario.");
      }
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
