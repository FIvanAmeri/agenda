"use client"

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Patient from "../components/interfaz/interfaz";
import AddPatientModal from '../components/Modals/AddPatientModal';
import EditPatientModal from '../components/Modals/EditPatientModal';
import FilterForm from "../components/FilterForm/FilterForm";
import Header from '../components/Header/Header';
import PatientTable from "../components/PatientTable/PatientTable";
import useFetchData from "../hooks/useFetchData";
import useFilters from "../hooks/useFilters";

export default function Principal() {
  const router = useRouter();
  const { patients, setPatients, user, error } = useFetchData();
  const { 
    selectedDate, setSelectedDate, 
    selectedPatientName, setSelectedPatientName,
    selectedPractice, setSelectedPractice,
    selectedObraSocial, setSelectedObraSocial,
    selectedInstitucion, setSelectedInstitucion 
  } = useFilters();
  
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const addPatient = (newPatient: Patient): void => {
    setPatients((prev) => [...prev, newPatient]);
  };

  const updatePatient = (updatedPatient: Patient): void => {
    setPatients((prev) =>
      prev.map((patient) => (patient.id === updatedPatient.id ? updatedPatient : patient))
    ); 
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setTimeout(() => setShowEditModal(true), 0);
  };

  const filteredPatients = patients.filter((patient) => {
    return (
      (selectedDate ? new Date(patient.dia).toISOString().split('T')[0] === selectedDate : true) &&
      (selectedPatientName ? patient.paciente.toLowerCase().includes(selectedPatientName.toLowerCase()) : true) &&
      (selectedPractice ? patient.practicas.toLowerCase().includes(selectedPractice.toLowerCase()) : true) &&
      (selectedObraSocial ? patient.obraSocial.toLowerCase().includes(selectedObraSocial.toLowerCase()) : true) &&
      (selectedInstitucion ? patient.institucion.toLowerCase().includes(selectedInstitucion.toLowerCase()) : true)
    );
  });

  return (
    <div className="min-h-screen flex flex-col relative bg-cyan-900">
      <Header 
        user={user} 
        handleLogout={handleLogout} 
        setShowAddModal={setShowAddModal} 
      />

      <FilterForm
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedPatientName={selectedPatientName}
        setSelectedPatientName={setSelectedPatientName}
        selectedPractice={selectedPractice}
        setSelectedPractice={setSelectedPractice}
        selectedObraSocial={selectedObraSocial}
        setSelectedObraSocial={setSelectedObraSocial}
        selectedInstitucion={selectedInstitucion}
        setSelectedInstitucion={setSelectedInstitucion}
        patients={patients}
      />

      {error && <div className="text-red-500 text-center mt-4">{error}</div>}

      <div className="mt-10">
        {patients.length === 0 ? (
          <div className="text-center">Cargando pacientes...</div>
        ) : (
          <PatientTable
            filteredPatients={filteredPatients}
            onEditClick={handleEditPatient}
          />
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <AddPatientModal
            onClose={() => setShowAddModal(false)}
            onAdd={addPatient}
          />
        </div>
      )}

      {showEditModal && selectedPatient && (
        <EditPatientModal
          selectedPatient={selectedPatient}
          updatePatient={updatePatient}
          setShowEditModal={setShowEditModal}
        />
      )}
    </div>
  );
}
