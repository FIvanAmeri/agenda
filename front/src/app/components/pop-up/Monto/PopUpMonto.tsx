"use client";

import React, { useState } from "react";

interface PopUpMontoProps {
  onGuardar: (monto: number) => void;
  onCancelar: () => void;
  titulo?: string;
}

export const PopUpMonto: React.FC<PopUpMontoProps> = ({
  onGuardar,
  onCancelar,
  titulo = "Ingresar Monto",
}) => {
  const [montoInput, setMontoInput] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = e.target.value;
    if (/^\d*\.?\d*$/.test(valor) || valor === "") {
      setMontoInput(valor);
    }
  };

  const handleGuardar = () => {
    const montoNumero = parseFloat(montoInput) || 0;
    if (montoNumero <= 0) {
      alert("El monto debe ser mayor a cero.");
      return;
    }
    onGuardar(montoNumero);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-6 w-80 border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-900">{titulo}</h3>
        <label
          htmlFor="monto"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Monto (ej: 20000.00)
        </label>
        <input
          id="monto"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*[.]?[0-9]*"
          value={montoInput}
          onChange={handleInputChange}
          className="mt-1 block w-full rounded-md border border-gray-300 shadow-sm focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500 p-2 text-gray-900 font-medium"
          placeholder="0.00"
        />
        <div className="mt-6 flex justify-end gap-3">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
            onClick={onCancelar}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 text-sm font-medium text-white bg-cyan-600 rounded-md hover:bg-cyan-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGuardar}
            disabled={montoInput === "" || parseFloat(montoInput) <= 0}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};
