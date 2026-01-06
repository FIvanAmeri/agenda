"use client";

import AuroraBackground from "../components/AuroraBackground";
import BotonVolver from "../components/BotonVolver";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useRecuperacion from "../hooks/Recuperacion/useRecuperacion";

export default function Recuperacion() {
  const [email, setEmail] = useState("");
  const [enviado, setEnviado] = useState(false);
  const { requestReset } = useRecuperacion();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestReset(email);
      setEnviado(true);
    } catch {
      alert("Error al solicitar la recuperación de contraseña.");
    }
  };

  useEffect(() => {
    if (enviado) {
      const timer = setTimeout(() => router.push("/"), 3000);
      return () => clearTimeout(timer);
    }
  }, [enviado, router]);

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <main className="main-with-aurora flex flex-col items-center justify-center gap-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Recuperar Contraseña
          </h2>

          {enviado ? (
            <p className="text-center text-green-600">
              Si el correo está registrado, se ha enviado un enlace para
              restablecer la contraseña.
            </p>
          ) : (
            <>
              <input
                id="email"
                type="email"
                className="mt-2 block w-full px-3 py-2 border border-gray-300 text-black rounded-md"
                placeholder="tuemail@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="w-full py-2 mt-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Enviar enlace
              </button>
                 <BotonVolver />
            </>
          )}
        </form>
     
      </main>
    </div>
  );
}
