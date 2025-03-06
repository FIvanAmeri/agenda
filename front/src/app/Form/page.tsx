"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Form() {
  const [usuario, setUsuario] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();


  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/Principal');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:3001/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ usuario, contrasena }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert(`Bienvenido ${data.user.usuario}`);
        router.push('/Principal'); 
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error al autenticar:', error);
      alert('Ocurrió un error. Intenta nuevamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm" onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="usuario" className="block text-sm font-medium text-gray-700 text-center">Usuario</label>
          <input
            id="usuario"
            type="text"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Escribe tu usuario"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="contrasena" className="block text-sm font-medium text-black text-center">Contraseña</label>
          <input
            id="contrasena"
            type="password"
            className="mt-2 block w-full px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Escribe tu contraseña"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
}
