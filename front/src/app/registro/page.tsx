"use client";

import AuroraBackground from "../components/AuroraBackground";
import BotonVolver from "../components/BotonVolver";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";

export default function Registro() {
  const [usuario, setUsuario] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmContrasena, setConfirmContrasena] = useState("");
  const router = useRouter();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (contrasena !== confirmContrasena) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    try {
      await register({ usuario, email, contrasena });
      alert("Registro exitoso. ¡Ahora puedes iniciar sesión!");
      router.push("/Form");
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Error desconocido al registrar el usuario.";
      alert(errorMessage);
    }
  };

  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <main className="main-with-aurora flex flex-col items-center justify-center gap-4">
        <form
          className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm"
          onSubmit={handleSubmit}
        >
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Crear Cuenta
          </h2>
          <input
            id="usuario"
            type="text"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 text-black rounded-md"
            placeholder="Usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
          <input
            id="email"
            type="email"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 text-black rounded-md"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            id="contrasena"
            type="password"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 text-black rounded-md"
            placeholder="Escribe tu contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
          <input
            id="confirmContrasena"
            type="password"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 text-black rounded-md"
            placeholder="Repite la contraseña"
            value={confirmContrasena}
            onChange={(e) => setConfirmContrasena(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full py-2 mt-4 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            Registrarme
          </button>
               <BotonVolver />
        </form>
      </main>
    </div>
  );
}
