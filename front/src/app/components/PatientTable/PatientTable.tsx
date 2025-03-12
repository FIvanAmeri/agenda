import React from "react";
import Patient from "../interfaz/interfaz";

interface PatientTableProps {
  filteredPatients: Patient[];
  onEditClick: (patient: Patient) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({
  filteredPatients,
  onEditClick,
}) => {
  const formatDate = (date: string) => {
    const parsedDate = new Date(date);
    const day = String(parsedDate.getUTCDate()).padStart(2, '0');
    const month = String(parsedDate.getUTCMonth() + 1).padStart(2, '0');
    const year = parsedDate.getUTCFullYear();
    return `${day}-${month}-${year}`;
  };


  const currentDate = new Date();
  const sortedPatients = filteredPatients.sort((a, b) => {
    const dateA = new Date(a.dia);
    const dateB = new Date(b.dia);

  
    const diffA = Math.abs(currentDate.getTime() - dateA.getTime());
    const diffB = Math.abs(currentDate.getTime() - dateB.getTime());

    return diffA - diffB;
  });

  return (
    <div className="mt-10">
      {sortedPatients.length > 0 ? (
        <ul>
          {sortedPatients.map((patient) => (
            <li
              key={patient.id}
              className="border-b p-4 transition-all duration-300 ease-in-out transform scale-95 hover:scale-100"
            >
              <div><strong>Paciente:</strong> {patient.paciente}</div>
              <div><strong>Fecha:</strong> {formatDate(patient.dia)}</div>
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
