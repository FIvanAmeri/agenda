"use client";

import React, { useState, useCallback, useEffect } from "react";

interface Props {
  onClose: () => void;
  onAdded: (medico: { id: number; nombre: string; apellido: string }) => void;
}

const AddMedicoModal: React.FC<Props> = ({ onClose, onAdded }) => {
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const close = useCallback(() => onClose(), [onClose]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [close]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token") ?? "";
      const res = await fetch("http://localhost:3001/api/medico", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ nombre, apellido }),
      });
      if (!res.ok) throw new Error("Error");
      const data = await res.json();
      onAdded(data.medico);
      alert("Medico agregado");
      close();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">Agregar Médico</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Nombre</label>
            <input value={nombre} onChange={(e) => setNombre(e.target.value)} required className="w-full p-2 border rounded-md" />
          </div>
          <div className="mb-3">
            <label className="block text-sm font-medium mb-1">Apellido</label>
            <input value={apellido} onChange={(e) => setApellido(e.target.value)} required className="w-full p-2 border rounded-md" />
          </div>
          {error && <div className="text-red-500 mb-2">{error}</div>}
          <div className="flex justify-end space-x-2">
            <button type="button" onClick={close} className="px-4 py-2 rounded-md border">Cancelar</button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-md bg-blue-600 text-white">Agregar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMedicoModal;
