import { useState } from 'react';
import {Patient} from '../interfaz/interfaz';

const usePatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);

  const addPatient = (newPatient: Patient): void => {
    setPatients((prev) => [...prev, newPatient]);
  };

  const updatePatient = (updatedPatient: Patient): void => {
    setPatients((prev) =>
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
  ): Patient[] => {
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

  return { patients, setPatients, addPatient, updatePatient, filteredPatients };
};

export default usePatientManagement;
