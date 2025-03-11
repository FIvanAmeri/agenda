import React, { useState } from 'react';
import Patient from "../../interfaz"

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
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre del Paciente</label>
          <input
            type="text"
            value={paciente}
            onChange={(e) => setPaciente(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Fecha</label>
          <input
            type="date"
            value={dia}
            onChange={(e) => setDia(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Prácticas</label>
          <input
            type="text"
            value={practicas}
            onChange={(e) => setPracticas(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Obra Social</label>
          <input
            type="text"
            value={obraSocial}
            onChange={(e) => setObraSocial(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Institución</label>
          <input
            type="text"
            value={institucion}
            onChange={(e) => setInstitucion(e.target.value)}
            required
          />
        </div>

        {error && <div className="text-red-500">{error}</div>}

        <div className="flex space-x-4 mt-4">
          <button
            type="button"
            onClick={() => setShowEditModal(false)}
            className="py-2 px-4 bg-gray-500 text-white rounded-md"
          >
            Cancelar
          </button>
          <button type="submit" className="py-2 px-4 bg-blue-500 text-white rounded-md">
            Guardar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPatientModal;
