import React from "react";
import Patient  from "../../interfaz";

interface PatientTableProps {
  patients: Patient[];
  filteredPatients: Patient[];
  onEditClick: (patient: Patient) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({
  patients,
  filteredPatients,
  onEditClick,
}) => {
  return (
    <table className="w-full text-left table-auto">
      <thead>
        <tr className="bg-lime-200">
          <th className="px-4 py-2 font-bold text-black">Día</th>
          <th className="px-4 py-2 font-bold text-black">Paciente</th>
          <th className="px-4 py-2 font-bold text-black">Prácticas</th>
          <th className="px-4 py-2 font-bold text-black">Obra Social</th>
          <th className="px-4 py-2 font-bold text-black">Institución</th>
          <th className="px-4 py-2 font-bold text-black">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient, index) => (
            <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
              <td className="px-4 py-2 text-black">{patient.dia}</td>
              <td className="px-4 py-2 text-black">{patient.paciente}</td>
              <td className="px-4 py-2 text-black">{patient.practicas}</td>
              <td className="px-4 py-2 text-black">{patient.obraSocial}</td>
              <td className="px-4 py-2 text-black">{patient.institucion}</td>
              <td className="px-4 py-2 text-black">
                <button
                  onClick={() => onEditClick(patient)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Editar
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={6} className="px-4 py-2 text-center text-black font-bold">
              No hay pacientes disponibles
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

export default PatientTable;
