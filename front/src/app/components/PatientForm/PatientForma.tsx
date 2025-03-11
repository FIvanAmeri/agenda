import React from "react";
import  Patient  from "../../interfaz";
import PatientFormInput from "../PatientForm/PatientFormInput";

interface PatientFormProps {
  patients: Patient[];
  selectedDate: string;
  selectedPatientName: string;
  selectedPractice: string;
  selectedObraSocial: string;
  selectedInstitucion: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  setSelectedPatientName: React.Dispatch<React.SetStateAction<string>>;
  setSelectedPractice: React.Dispatch<React.SetStateAction<string>>;
  setSelectedObraSocial: React.Dispatch<React.SetStateAction<string>>;
  setSelectedInstitucion: React.Dispatch<React.SetStateAction<string>>;
}

const PatientForm: React.FC<PatientFormProps> = ({
  patients,
  selectedDate,
  selectedPatientName,
  selectedPractice,
  selectedObraSocial,
  selectedInstitucion,
  setSelectedDate,
  setSelectedPatientName,
  setSelectedPractice,
  setSelectedObraSocial,
  setSelectedInstitucion,
}) => {
  return (
    <div className="mb-4 flex gap-4">
      <PatientFormInput
        label="Selecciona una fecha:"
        type="date"
        value={selectedDate}
        onChange={setSelectedDate}
      />
      <PatientFormInput
        label="Paciente:"
        type="select"
        value={selectedPatientName}
        onChange={setSelectedPatientName}
        options={Array.from(new Set(patients.map((patient) => patient.paciente)))}
      />
      <PatientFormInput
        label="Prácticas:"
        type="select"
        value={selectedPractice}
        onChange={setSelectedPractice}
        options={Array.from(new Set(patients.map((patient) => patient.practicas)))}
      />
      <PatientFormInput
        label="Obra Social:"
        type="select"
        value={selectedObraSocial}
        onChange={setSelectedObraSocial}
        options={Array.from(new Set(patients.map((patient) => patient.obraSocial)))}
      />
      <PatientFormInput
        label="Institución:"
        type="select"
        value={selectedInstitucion}
        onChange={setSelectedInstitucion}
        options={Array.from(new Set(patients.map((patient) => patient.institucion)))}
      />
    </div>
  );
};

export default PatientForm;
