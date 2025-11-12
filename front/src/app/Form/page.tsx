"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useAuth from "../hooks/useAuth";

export default function Form() {
  const [usuario, setUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const { login, token, loading: authLoading } = useAuth();

  useEffect(() => {
    if (token) {
      router.push("/Principal");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      await login({ usuario, contrasena });
      setMessage("Inicio de sesión exitoso");
    } catch (error) {
      if (error instanceof Error) {
        setMessage(`Error: ${error.message}`);
      } else {
        setMessage("Error desconocido.");
      }
    }
  };

  if (token || authLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-lg text-gray-500">Iniciando sesión, por favor espere...</p>
        <div className="w-24 h-24">
          <svg
            className="w-full h-full animate-spin"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
        
            <path
              d="M32 4C28 4 24 8 24 12V44C24 48 28 52 32 52C36 52 40 48 40 44V12C40 8 36 4 32 4Z"
              fill="#3B82F6"
            />
        
            <circle cx="32" cy="16" r="6" fill="#FCD34D" />
       
            <path
              d="M28 44C28 46 36 46 36 44"
              stroke="#10B981"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        className="bg-white p-8 rounded-lg shadow-2xl w-full max-w-sm"
        onSubmit={handleSubmit}
      >
        <h2 className="text-3xl font-extrabold mb-6 text-center text-blue-600">
          Iniciar Sesión
        </h2>

        {message && (
          <div
            className={`mb-4 p-3 rounded text-center font-medium ${
              message.startsWith("Error")
                ? "bg-red-100 text-red-700 border border-red-300"
                : "bg-green-100 text-green-700 border border-green-300"
            }`}
          >
            {message.replace("Error: ", "")}
          </div>
        )}

        <div className="mb-4">
          <label
            htmlFor="usuario"
            className="block text-sm font-semibold text-gray-700 text-center"
          >
            Usuario
          </label>
          <input
            id="usuario"
            type="text"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe tu usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="contrasena"
            className="block text-sm font-semibold text-gray-700 text-center"
          >
            Contraseña
          </label>
          <input
            id="contrasena"
            type="password"
            className="mt-2 block w-full px-4 py-2 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Escribe tu contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300"
        >
          Iniciar sesión
        </button>

        <div className="mt-6 text-center space-y-3">
          <button
            type="button"
            onClick={() => router.push("/registro")}
            className="text-sm text-green-600 hover:text-green-700 block w-full font-medium"
          >
            ¿No tienes cuenta? <strong>Regístrate aquí</strong>
          </button>
          <button
            type="button"
            onClick={() => router.push("/recuperacion")}
            className="text-sm text-gray-500 hover:text-gray-700 block w-full"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
      </form>
    </div>
  );
}
