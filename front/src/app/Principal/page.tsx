"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Patient from "../components/interfaz/interfaz";
import AddPatientModal from '../components/Modals/AddPatientModal';
import EditPatientModal from '../components/Modals/EditPatientModal';
import FilterForm from "../components/FilterForm/FilterForm";
import Header from '../components/Header/Header';
import PatientTable from "../components/PatientTable/PatientTable";

export default function Principal() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [user, setUser] = useState<string>(""); 
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(""); 
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");
  const [selectedPractice, setSelectedPractice] = useState<string>("");
  const [selectedObraSocial, setSelectedObraSocial] = useState<string>("");
  const [selectedInstitucion, setSelectedInstitucion] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?.usuario) {
      setUser(storedUser.usuario.trim().charAt(0).toUpperCase() + storedUser.usuario.trim().slice(1));
    }

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
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const addPatient = (newPatient: Patient) => {
    setPatients((prev) => [...prev, newPatient]);
  };

  const updatePatient = (updatedPatient: Patient) => {
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
      (selectedDate ? new Date(patient.dia).toISOString().split("T")[0] === selectedDate : true) &&
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
