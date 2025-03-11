import React, { useState } from 'react';
import Patient from "../interfaz/interfaz";

interface EditPatientModalProps {
  selectedPatient: Patient;
  updatePatient: (updatedPatient: Patient) => void;
  setShowEditModal: (value: boolean) => void;
}

const EditPatientModal: React.FC<EditPatientModalProps> = ({ selectedPatient, updatePatient, setShowEditModal }) => {
  const [dia, setDia] = useState(selectedPatient.dia);
  const [paciente, setPaciente] = useState(selectedPatient.paciente);
  const [practicas, setPracticas] = useState(selectedPatient.practicas);
  const [obraSocial, setObraSocial] = useState(selectedPatient.obraSocial);
  const [institucion, setInstitucion] = useState(selectedPatient.institucion);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedPatient = {
      id: selectedPatient.id,
      dia,
      paciente,
      practicas,
      obraSocial,
      institucion,
    };

    try {
      const response = await fetch(`http://localhost:3001/api/paciente/${selectedPatient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPatient),
      });

      if (!response.ok) {
        throw new Error('Error al editar el paciente');
      }

      const result = await response.json();
      updatePatient(result.paciente);
      setShowEditModal(false);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Hubo un error');
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-white text-center">Editar Paciente</h2>
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
            <input
              type="text"
              value={obraSocial}
              onChange={(e) => setObraSocial(e.target.value)}
              required
              className="w-full mt-2 p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
              onClick={() => setShowEditModal(false)}
              className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 w-full"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 w-full"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatientModal;
