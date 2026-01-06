import { useState } from "react";
import { Patient } from "../components/interfaz/interfaz";

const usePatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addPatient = (newPatient: Patient) => {
    setPatients((prev: Patient[]) => [...prev, newPatient]);
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients((prev: Patient[]) =>
      prev.map((patient) =>
        patient.id === updatedPatient.id ? updatedPatient : patient
      )
    );
  };
  
  const deletePatient = (id: number) => {
    setPatients((prev: Patient[]) => prev.filter(p => p.id !== id));
  }

  const filteredPatients = (filterParams: {
    selectedDate: string;
    selectedPatientName: string;
    selectedPractice: string;
    selectedObraSocial: string;
    selectedInstitucion: string;
  }) => {
    const { selectedDate, selectedPatientName, selectedPractice, selectedObraSocial, selectedInstitucion } = filterParams;

    return patients.filter((patient) => {
      const matchDate = selectedDate ? new Date(patient.dia).toISOString().split("T")[0] === selectedDate : true;
      const matchName = selectedPatientName ? patient.paciente.toLowerCase().includes(selectedPatientName.toLowerCase()) : true;
      const matchPractice = selectedPractice ? patient.practicas.toLowerCase().includes(selectedPractice.toLowerCase()) : true;
      const matchObraSocial = selectedObraSocial ? patient.obraSocial.toLowerCase().includes(selectedObraSocial.toLowerCase()) : true;
      const matchInstitucion = selectedInstitucion ? patient.institucion.toLowerCase().includes(selectedInstitucion.toLowerCase()) : true;

      return matchDate && matchName && matchPractice && matchObraSocial && matchInstitucion;
    });
  };

  return { patients, setPatients, addPatient, updatePatient, deletePatient, filteredPatients, error, setError };
};

export default usePatientManagement;