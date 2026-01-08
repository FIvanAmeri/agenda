"use client";

import AuroraBackground from "../components/AuroraBackground";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useResetPassword from "../hooks/Recuperacion/useResetPassword";

function ResetPasswordContent() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [token, setToken] = useState("");
  const [done, setDone] = useState(false);
  const { resetPassword, loading } = useResetPassword();
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const t = searchParams.get("token");
    if (t) {
      setToken(t);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      alert("Token no encontrado.");
      return;
    }
    if (password !== confirm) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    const response = await resetPassword(token, password);
    if (response.error) {
      alert(response.error);
    } else {
      setDone(true);
      setTimeout(() => router.push("/"), 3000);
    }
  };

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <main className="main-with-aurora flex items-center justify-center">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Restablecer Contraseña</h2>
          {!token && !done && <p className="text-center text-red-500 text-sm mb-4">Enlace no válido.</p>}
          {done ? (
            <p className="text-center text-green-600 font-medium">Contraseña modificada. Redirigiendo...</p>
          ) : (
            <>
              <input
                id="password"
                type="password"
                className="mt-2 block w-full px-3 py-2 border border-gray-300 text-black rounded-md outline-none"
                placeholder="Nueva contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <input
                id="confirm"
                type="password"
                className="mt-2 block w-full px-3 py-2 border border-gray-300 text-black rounded-md outline-none"
                placeholder="Confirmar contraseña"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
              <button
                type="submit"
                disabled={!token || loading}
                className={`w-full py-2 mt-4 text-white rounded-md ${!token || loading ? "bg-gray-400" : "bg-indigo-600"}`}
              >
                {loading ? "Procesando..." : "Cambiar Contraseña"}
              </button>
            </>
          )}
        </form>
      </main>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Cargando...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}