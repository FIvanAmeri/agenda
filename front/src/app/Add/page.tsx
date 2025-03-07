import React, { useState } from "react";
import { format } from "date-fns";

interface AddProps {
  onClose: () => void;
  onAdd: (newPatient: Patient) => void;
}

interface Patient {
  id: string;
  dia: string;
  paciente: string;
  practicas: string;
  obraSocial: string;
  institucion: string;
}

export default function Add({ onClose, onAdd }: AddProps) {
  const [dia, setDia] = useState<string>("");
  const [paciente, setPaciente] = useState("");
  const [practica, setPractica] = useState("");
  const [obraSocial, setObraSocial] = useState("");
  const [institucion, setInstitucion] = useState("");

  const handleSubmit = async () => {
    if (!dia || !paciente || !practica || !obraSocial || !institucion) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const nuevoPaciente: Patient = {
      id: crypto.randomUUID(),
      dia: format(new Date(dia), "dd/MM/yyyy"),
      paciente,
      practicas: practica,
      obraSocial,
      institucion,
    };

    try {
      const response = await fetch("http://localhost:3001/api/paciente", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoPaciente),
      });

      if (response.ok) {
        alert("Paciente agregado con éxito");
        onAdd(nuevoPaciente);
        onClose();
      } else {
        alert("Error al agregar paciente");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4 text-black">Agregar Paciente</h2>

        <label className="block mb-2 text-black">Día:</label>
        <input
          type="date"
          value={dia}
          onChange={(e) => setDia(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <label className="block mb-2 text-black">Paciente:</label>
        <input
          type="text"
          value={paciente}
          onChange={(e) => setPaciente(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <label className="block mb-2 text-black">Práctica:</label>
        <input
          type="text"
          value={practica}
          onChange={(e) => setPractica(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <label className="block mb-2 text-black">Obra Social:</label>
        <input
          type="text"
          value={obraSocial}
          onChange={(e) => setObraSocial(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <label className="block mb-2 text-black">Institución:</label>
        <input
          type="text"
          value={institucion}
          onChange={(e) => setInstitucion(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />

        <div className="flex justify-between mt-4">
          <button
            onClick={onClose}
            className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 w-1/2 mr-2"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-1/2"
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  );
}
