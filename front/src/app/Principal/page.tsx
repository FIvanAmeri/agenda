"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Patient, User } from "../components/interfaz/interfaz";
import AddPatientModal from "../components/Modals/AddPatientModal";
import EditPatientModal from "../components/Modals/EditPatientModal";
import FilterForm from "../components/FilterForm/FilterForm";
import Header from "../components/Header/Header";
import PatientTable from "../components/PatientTable/PatientTable";
import usePatients from "../hooks/usePatients";
import useFilters from "../hooks/useFilters";
import useAuth from "../hooks/useAuth";

export default function Principal() {
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();
  const { patients, setPatients, loading: patientsLoading, error: patientsError } = usePatients();
  const {
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
  } = useFilters();

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !token) {
      router.replace("/");
    }
  }, [authLoading, token, router]);


  if (authLoading || patientsLoading || !user) {
    return <div className="text-center text-gray-300 mt-10">Cargando...</div>;
  }
  if (!token) return null; 

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/");
  };

  const addPatient = (newPatient: Patient) => {
    setPatients((prev) => {
        const currentPatients = Array.isArray(prev) ? prev : [];
        return [...currentPatients, newPatient];
    });
    alert("Paciente agregado con éxito");
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients((prev) => 
        (Array.isArray(prev) ? prev : []).map((p) => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    alert("Paciente editado correctamente");
  };

  const deletePatient = async (patientId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/paciente/${patientId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!response.ok) throw new Error("Error al eliminar paciente");


      setPatients((prev) => (Array.isArray(prev) ? prev : []).filter((p) => p.id !== patientId));
      alert("Paciente eliminado");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Hubo un error");
    }
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowEditModal(true);
  };


  const dataToFilter = Array.isArray(patients) ? patients : [];

  const filteredPatients = dataToFilter.filter((patient) => {
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
        user={user.usuario}
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
        patients={dataToFilter} 
      />

      {(patientsError || (dataToFilter.length === 0 && !patientsLoading)) && 
          <div className="text-red-500 text-center mt-4">
            {patientsError || "No se encontraron pacientes."}
          </div>
      }


      <div className="mt-10">
        {dataToFilter.length === 0 && !patientsLoading ? (
          <div className="text-center text-gray-300">Esperando datos...</div>
        ) : (
          <PatientTable
            filteredPatients={filteredPatients}
            onEditClick={handleEditPatient}
            onDeleteClick={deletePatient}
          />
        )}
      </div>

      {showAddModal && user && (
        <AddPatientModal
          user={user}
          onClose={() => setShowAddModal(false)}
          onAdd={addPatient}
        />
      )}

      {showEditModal && selectedPatient && user && (
        <EditPatientModal
          selectedPatient={selectedPatient}
          user={user}
          updatePatient={updatePatient}
          setShowEditModal={setShowEditModal}
        />
      )}
    </div>
  );
}