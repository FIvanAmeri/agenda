"use client";

import React, { useState } from "react";

interface PopUpMontoProps {
  onGuardar: (monto: number, fecha: string) => void;
  onCancelar: () => void;
  titulo?: string;
}

export const PopUpMonto: React.FC<PopUpMontoProps> = ({
  onGuardar,
  onCancelar,
  titulo = "Monto",
}) => {
  const [monto, setMonto] = useState("");
  const [fecha, setFecha] = useState("");

  const handleGuardar = () => {
    const n = Number(monto);
    if (!isNaN(n) && n >= 0 && fecha) {
      onGuardar(n, fecha);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
      <div className="w-96 p-6 rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.15)] 
                      bg-[#f7efe5] border border-[#e2d6c9]">

        <h2 className="text-2xl font-semibold text-[#5c4a3f] mb-5">
          {titulo}
        </h2>

        <input
          type="number"
          className="w-full p-3 rounded-lg border border-[#d4c7ba] 
                     bg-[#fffaf5] text-[#4a3c31] focus:outline-none
                     focus:ring-2 focus:ring-[#c7a27e] mb-4"
          value={monto}
          onChange={(e) => setMonto(e.target.value)}
          placeholder="Ingrese el monto"
        />

        <input
          type="date"
          className="w-full p-3 rounded-lg border border-[#d4c7ba] 
                     bg-[#fffaf5] text-[#4a3c31] focus:outline-none
                     focus:ring-2 focus:ring-[#c7a27e]"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={handleGuardar}
            className="px-4 py-2 rounded-lg bg-[#c7a27e] 
                       hover:bg-[#b8926d] text-white font-medium"
          >
            Guardar
          </button>

          <button
            onClick={onCancelar}
            className="px-4 py-2 rounded-lg bg-[#e2d6c9] 
                       hover:bg-[#d4c7ba] text-[#4a3c31] font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};
