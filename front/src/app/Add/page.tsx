"use client";
import React, { useState, useEffect } from "react";
import { useObrasSociales } from "../context/ObrasSocialesContext";

interface AddProps {
  onClose: () => void;
  onAdd: (newPatient: any) => void;
  patientData?: {
    dia: string;
    paciente: string;
    practicas: string;
    obraSocial: string;
    institucion: string;
  };
}

const Add = ({ onClose, onAdd, patientData }: AddProps) => {
  const { obrasSociales } = useObrasSociales();
  const [dia, setDia] = useState(patientData?.dia || "");
  const [paciente, setPaciente] = useState(patientData?.paciente || "");
  const [practicas, setPracticas] = useState(patientData?.practicas || "");
  const [obraSocial, setObraSocial] = useState(patientData?.obraSocial || "");
  const [institucion, setInstitucion] = useState(patientData?.institucion || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient = { dia, paciente, practicas, obraSocial, institucion };
    onAdd(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-md w-96 text-black">
        <h2 className="text-xl font-bold mb-4">Agregar Paciente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            <label className="block font-bold mb-2">Día</label>
            <input
              type="date"
              value={dia}
              onChange={(e) => setDia(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2">Paciente</label>
            <input
              type="text"
              value={paciente}
              onChange={(e) => setPaciente(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2">Prácticas</label>
            <input
              type="text"
              value={practicas}
              onChange={(e) => setPracticas(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2">Obra Social</label>
            <select
              value={obraSocial}
              onChange={(e) => setObraSocial(e.target.value)}
              className="w-full p-2 border rounded"
            >
              {obrasSociales.map((obra, index) => (
                <option key={index} value={obra}>
                  {obra}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block font-bold mb-2">Institución</label>
            <input
              type="text"
              value={institucion}
              onChange={(e) => setInstitucion(e.target.value)}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-gray-500 text-white rounded-md"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-blue-500 text-white rounded-md"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Add;
