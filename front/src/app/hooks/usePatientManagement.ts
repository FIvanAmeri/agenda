import { useState, useEffect } from "react";
import Patient from "../components/interfaz/interfaz";

const usePatientManagement = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/paciente");
        if (!response.ok) throw new Error("No se pudo obtener los pacientes");
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      }
    };

    fetchPatients();
  }, []);

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

  const filteredPatients = (filterParams: {
    selectedDate: string;
    selectedPatientName: string;
    selectedPractice: string;
    selectedObraSocial: string;
    selectedInstitucion: string;
  }) => {
    const { selectedDate, selectedPatientName, selectedPractice, selectedObraSocial, selectedInstitucion } = filterParams;

    return patients.filter((patient) => {
      return (
        (selectedDate ? new Date(patient.dia).toISOString().split("T")[0] === selectedDate : true) &&
        (selectedPatientName ? patient.paciente.toLowerCase().includes(selectedPatientName.toLowerCase()) : true) &&
        (selectedPractice ? patient.practicas.toLowerCase().includes(selectedPractice.toLowerCase()) : true) &&
        (selectedObraSocial ? patient.obraSocial.toLowerCase().includes(selectedObraSocial.toLowerCase()) : true) &&
        (selectedInstitucion ? patient.institucion.toLowerCase().includes(selectedInstitucion.toLowerCase()) : true)
      );
    });
  };

  return { patients, setPatients, error, addPatient, updatePatient, filteredPatients };
};

export default usePatientManagement;
