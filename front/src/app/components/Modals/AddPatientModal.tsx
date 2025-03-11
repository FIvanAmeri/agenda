import React, { useState } from 'react';
import { useObrasSociales } from '../../hooks/useObrasSociales';
import Patient from "../interfaz/interfaz";

interface AddPatientModalProps {
  onClose: () => void;
  onAdd: (newPatient: Patient) => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ onClose, onAdd }) => {
  const { obrasSociales } = useObrasSociales();
  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const [dia, setDia] = useState<string>(getCurrentDate());
  const [paciente, setPaciente] = useState('');
  const [practicas, setPracticas] = useState('');
  const [obraSocial, setObraSocial] = useState('');
  const [institucion, setInstitucion] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newPatient = {
      dia,
      paciente,
      practicas,
      obraSocial,
      institucion,
    };

    try {
      const response = await fetch('http://localhost:3001/api/paciente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPatient),
      });

      if (!response.ok) {
        throw new Error('Error al crear el paciente');
      }

      const result = await response.json();
      onAdd(result.paciente);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Hubo un error');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-white text-center">Agregar Paciente</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200">Fecha</label>
            <input
              type="date"
              value={dia}
              onChange={(e) => setDia(e.target.value)}
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200">Nombre del Paciente</label>
            <input
              type="text"
              value={paciente}
              onChange={(e) => setPaciente(e.target.value)}
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200">Prácticas</label>
            <input
              type="text"
              value={practicas}
              onChange={(e) => setPracticas(e.target.value)}
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200">Obra Social</label>
            <select
              value={obraSocial}
              onChange={(e) => setObraSocial(e.target.value)}
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {obrasSociales.map((option, index) => (
                <option key={index} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-200">Institución</label>
            <input
              type="text"
              value={institucion}
              onChange={(e) => setInstitucion(e.target.value)}
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

          <div className="flex justify-between mt-6 space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 w-full"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 w-full"
            >
              Agregar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPatientModal;
