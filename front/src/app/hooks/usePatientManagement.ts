
import { useState } from 'react';
import Patient from '../components/interfaz/interfaz';

const usePatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const addPatient = (newPatient: Patient) => {
    setPatients((prev: Patient[]) => [...prev, newPatient]);
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients((prev: Patient[]) =>
      prev.map((patient) => (patient.id === updatedPatient.id ? updatedPatient : patient))
    );
  };

  const filteredPatients = (
    patients: Patient[],
    selectedDate: string,
    selectedPatientName: string,
    selectedPractice: string,
    selectedObraSocial: string,
    selectedInstitucion: string
  ) => {
    return patients.filter((patient) => {
      return (
        (selectedDate ? new Date(patient.dia).toISOString().split('T')[0] === selectedDate : true) &&
        (selectedPatientName ? patient.paciente.toLowerCase().includes(selectedPatientName.toLowerCase()) : true) &&
        (selectedPractice ? patient.practicas.toLowerCase().includes(selectedPractice.toLowerCase()) : true) &&
        (selectedObraSocial ? patient.obraSocial.toLowerCase().includes(selectedObraSocial.toLowerCase()) : true) &&
        (selectedInstitucion ? patient.institucion.toLowerCase().includes(selectedInstitucion.toLowerCase()) : true)
      );
    });
  };

  return { patients, setPatients, addPatient, updatePatient, filteredPatients, loading, error };
};

export default usePatientManagement;
