import React, { useMemo } from "react";
import Patient from "../../interfaz"

interface FilterFormProps {
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  selectedPatientName: string;
  setSelectedPatientName: React.Dispatch<React.SetStateAction<string>>;
  selectedPractice: string;
  setSelectedPractice: React.Dispatch<React.SetStateAction<string>>;
  selectedObraSocial: string;
  setSelectedObraSocial: React.Dispatch<React.SetStateAction<string>>;
  selectedInstitucion: string;
  setSelectedInstitucion: React.Dispatch<React.SetStateAction<string>>;
  patients: Patient[];
}

const FilterForm: React.FC<FilterFormProps> = ({
  selectedDate,
  setSelectedDate,
  selectedPatientName,
  setSelectedPatientName,
  selectedPractice,
  setSelectedPractice,
  selectedObraSocial,
  setSelectedObraSocial,
  selectedInstitucion,
  setSelectedInstitucion,
  patients,
}) => {
  const patientNames = useMemo(() => {
    const names = new Set(patients.map((patient) => patient.paciente));
    return Array.from(names);
  }, [patients]);

  const practices = useMemo(() => {
    const practicesSet = new Set(patients.map((patient) => patient.practicas));
    return Array.from(practicesSet);
  }, [patients]);

  const obrasSociales = useMemo(() => {
    const obrasSet = new Set(patients.map((patient) => patient.obraSocial));
    return Array.from(obrasSet);
  }, [patients]);

  const instituciones = useMemo(() => {
    const institucionesSet = new Set(patients.map((patient) => patient.institucion));
    return Array.from(institucionesSet);
  }, [patients]);

  return (
    <div className="space-y-4 grid grid-cols-2 gap-4">
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="w-full p-1 border rounded-md text-sm text-black"
        placeholder="Filtrar por fecha"
      />
      <select
        value={selectedPatientName}
        onChange={(e) => setSelectedPatientName(e.target.value)}
        className="w-full p-1 border rounded-md text-sm text-black "
      >
        <option value="">Filtrar por paciente</option>
        {patientNames.map((patientName, index) => (
          <option key={index} value={patientName}>
            {patientName}
          </option>
        ))}
      </select>
      <select
        value={selectedPractice}
        onChange={(e) => setSelectedPractice(e.target.value)}
        className="w-full p-1 border rounded-md text-sm text-black"
      >
        <option value="">Filtrar por práctica</option>
        {practices.map((practice, index) => (
          <option key={index} value={practice}>
            {practice}
          </option>
        ))}
      </select>
      <select
        value={selectedObraSocial}
        onChange={(e) => setSelectedObraSocial(e.target.value)}
        className="w-full p-1 border rounded-md text-sm text-black"
      >
        <option value="">Filtrar por obra social</option>
        {obrasSociales.map((obraSocial, index) => (
          <option key={index} value={obraSocial}>
            {obraSocial}
          </option>
        ))}
      </select>
      <select
        value={selectedInstitucion}
        onChange={(e) => setSelectedInstitucion(e.target.value)}
        className="w-full p-1 border rounded-md text-sm text-black"
      >
        <option value="">Filtrar por institución</option>
        {instituciones.map((institucion, index) => (
          <option key={index} value={institucion}>
            {institucion}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterForm;
