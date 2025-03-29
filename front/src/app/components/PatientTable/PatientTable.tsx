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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    
    const day = String(adjustedDate.getDate()).padStart(2, '0');
    const month = String(adjustedDate.getMonth() + 1).padStart(2, '0');
    const year = adjustedDate.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (timeString: string) => {
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
      return timeString;
    }
    
    const time = new Date(timeString);
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };


  const sortedPatients = [...filteredPatients].sort((a, b) => {
    const dateA = new Date(a.dia);
    const dateB = new Date(b.dia);
    return dateA.getTime() - dateB.getTime();
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
              <div><strong>Hora:</strong> {formatTime(patient.hora)}</div>
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