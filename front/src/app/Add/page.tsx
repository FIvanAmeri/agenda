"use client";

import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useObrasSociales } from "../context/ObrasSocialesContext";
import { format } from "date-fns";

interface AddProps {
  onClose: () => void;
  onAdd: (newPatient: Patient) => void;
}

interface Patient {
  dia: string;
  paciente: string;
  practicas: string;
  obraSocial: string;
}

export default function Add({ onClose, onAdd }: AddProps) {
  const [dia, setDia] = useState<Date | null>(null);
  const [paciente, setPaciente] = useState("");
  const [practica, setPractica] = useState("");
  const [obraSocial, setObraSocial] = useState("");
  const [errors, setErrors] = useState<{ paciente?: string; practica?: string }>({});
  const { obrasSociales } = useObrasSociales();

  const validateForm = () => {
    let newErrors: { paciente?: string; practica?: string } = {};

    if (!/^[a-zA-Z\s]+$/.test(paciente.trim())) {
      newErrors.paciente = "Solo se permiten letras.";
    }

    if (!/^[a-zA-Z0-9\s]+$/.test(practica.trim())) {
      newErrors.practica = "Solo se permiten letras y números.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePacienteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s]*$/.test(value)) {
      setPaciente(value);
      setErrors((prev) => ({ ...prev, paciente: "" }));
    } else {
      setErrors((prev) => ({ ...prev, paciente: "Solo se permiten letras." }));
    }
  };

  const handleSubmit = async () => {
    let missingFields = [];

    if (!dia) missingFields.push("Día");
    if (!paciente) missingFields.push("Paciente");
    if (!practica) missingFields.push("Práctica");
    if (!obraSocial) missingFields.push("Obra Social");

    if (missingFields.length > 0) {
      alert(`Por favor, completa los siguientes campos: ${missingFields.join(", ")}`);
      return;
    }

    if (!validateForm()) return;

    const nuevoPaciente = {
      dia: dia ? format(dia, "dd/MM/yyyy") : "",
      paciente,
      practicas: practica,
      obraSocial,
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
        <DatePicker
          selected={dia}
          onChange={(date: Date | null) => setDia(date)}
          className="w-full p-2 border rounded-md text-black"
          dateFormat="dd/MM/yyyy"
          placeholderText="Selecciona una fecha"
        />

        <label className="block mt-4 mb-2 text-black">Paciente:</label>
        <input
          type="text"
          value={paciente}
          onChange={handlePacienteChange}
          className="w-full p-2 border rounded-md text-black"
        />
        {errors.paciente && <p className="text-red-500 text-sm">{errors.paciente}</p>}

        <label className="block mt-4 mb-2 text-black">Práctica:</label>
        <input
          type="text"
          value={practica}
          onChange={(e) => setPractica(e.target.value)}
          className="w-full p-2 border rounded-md text-black"
        />
        {errors.practica && <p className="text-red-500 text-sm">{errors.practica}</p>}

        <label className="block mt-4 mb-2 text-black">Obra Social:</label>
        <select
          value={obraSocial}
          onChange={(e) => setObraSocial(e.target.value)}
          className="w-full p-2 border rounded-md text-black"
        >
          {obrasSociales.map((obra, index) => (
            <option key={index} value={obra}>
              {obra}
            </option>
          ))}
        </select>

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="mr-2 p-2 bg-gray-400 rounded-md hover:bg-gray-500">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600">
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
}
