// components/PatientTable/PatientTable.tsx

import React from "react";
import Patient from "../interfaz/interfaz";  // Importación correcta de la interfaz

interface PatientTableProps {
  filteredPatients: Patient[];  // Esta es la propiedad esperada
  onEditClick: (patient: Patient) => void;  // Esta es la propiedad esperada
}

const PatientTable: React.FC<PatientTableProps> = ({
  filteredPatients,
  onEditClick,
}) => {
  return (
    <div className="mt-10">
      {filteredPatients.length > 0 ? (
        <ul>
          {filteredPatients.map((patient) => (
            <li
              key={patient.id}
              className="border-b p-4 transition-all duration-300 ease-in-out transform scale-95 hover:scale-100"
            >
              <div><strong>Paciente:</strong> {patient.paciente}</div>
              <div><strong>Fecha:</strong> {patient.dia}</div>
              <div><strong>Prácticas:</strong> {patient.practicas}</div>
              <div><strong>Obra Social:</strong> {patient.obraSocial}</div>
              <div><strong>Institución:</strong> {patient.institucion}</div>
              <button
                onClick={() => onEditClick(patient)}
                className="py-2 px-4 bg-emerald-400 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
              >
                Editar
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center">No se encontraron pacientes.</div>
      )}
    </div>
  );
};

export default PatientTable;
