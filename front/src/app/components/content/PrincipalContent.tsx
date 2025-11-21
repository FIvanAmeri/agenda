"use client";

import React from "react";
import { Patient, User } from "../../components/interfaz/interfaz"; 
import AddPatientModal from "../../components/Modals/AddPatientModal";
import EditPatientModal from "../../components/Modals/EditPatientModal";
import FilterForm from "../../components/FilterForm/FilterForm";
import PatientTable from "../../components/PatientTable/PatientTable";
import usePatients from "../../hooks/usePatients";
import useFilters from "../../hooks/useFilters";


interface PrincipalContentProps {
  user: User;
  showAddModal: boolean;
  setShowAddModal: (show: boolean) => void;
  showEditModal: boolean;
  setShowEditModal: (show: boolean) => void;
  selectedPatient: Patient | null;
  setSelectedPatient: (patient: Patient | null) => void;
}


export default function PrincipalContent({
  user,
  showAddModal,
  setShowAddModal,
  showEditModal,
  setShowEditModal,
  selectedPatient,
  setSelectedPatient,
}: PrincipalContentProps) {

  
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

      if (!response.ok) {
        let errorMessage = `Error ${response.status}: Fallo de comunicación.`;
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (e) {
            if (response.status === 404) {
                errorMessage = "Error 404: Ruta de eliminación no encontrada en el servidor.";
            } else {
                errorMessage = `Error ${response.status}: La respuesta no fue JSON.`;
            }
        }
        
        throw new Error(errorMessage);
      }

      setPatients((prev) => (Array.isArray(prev) ? prev : []).filter((p) => p.id !== patientId));
      alert("Paciente eliminado");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Hubo un error al borrar el paciente.");
    }
  };


  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowEditModal(true);
  };


  const dataToFilter = Array.isArray(patients) ? patients : [];
  
  const isFilterActive = 
    selectedDate || 
    selectedPatientName || 
    selectedPractice || 
    selectedObraSocial || 
    selectedInstitucion;

  let filteredPatients: Patient[];

  if (!isFilterActive) {
      filteredPatients = dataToFilter;
  } else {
      filteredPatients = dataToFilter.filter((patient) => {
        return (
          (selectedDate ? new Date(patient.dia).toISOString().split("T")[0] === selectedDate : true) &&
          (selectedPatientName ? patient.paciente.toLowerCase().includes(selectedPatientName.toLowerCase()) : true) &&
          (selectedPractice ? patient.practicas.toLowerCase().includes(selectedPractice.toLowerCase()) : true) &&
          (selectedObraSocial ? patient.obraSocial.toLowerCase().includes(selectedObraSocial.toLowerCase()) : true) &&
          (selectedInstitucion ? patient.institucion.toLowerCase().includes(selectedInstitucion.toLowerCase()) : true)
        );
      });
  }


  return (
    <div className="flex flex-col flex-1 p-8"> 
      
      <h1 className="text-center text-2xl font-semibold mb-6 text-gray-50">
        Agenda de Turnos
      </h1>

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

      {patientsError && 
        <div className="text-red-500 text-center mt-4">
          Error al cargar pacientes: {patientsError}
        </div>
      }

      <div className="mt-4">
        {dataToFilter.length === 0 && !patientsLoading ? (
          <div className="text-center text-gray-300">No se encontraron pacientes.</div>
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