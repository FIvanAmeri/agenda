"use client";

import React from "react";
import { Patient, User } from "../../components/interfaz/interfaz";
import AddPatientModal from "../../components/Modals/AddPatientModal";
import EditPatientModal from "../../components/Modals/EditPatientModal";
import FilterForm from "../../components/FilterForm/FilterForm";
import PatientTable from "../../components/PatientTable/PatientTable";
import usePatients from "../../hooks/usePatients";
import { useFilters } from "../../hooks/useFilters";

export default function PrincipalContent({
  user,
  showAddModal,
  setShowAddModal,
  showEditModal,
  setShowEditModal,
  selectedPatient,
  setSelectedPatient
}: {
  user: User;
  showAddModal: boolean;
  setShowAddModal: (s: boolean) => void;
  showEditModal: boolean;
  setShowEditModal: (s: boolean) => void;
  selectedPatient: Patient | null;
  setSelectedPatient: (p: Patient | null) => void;
}) {
  const { patients, setPatients, loading: patientsLoading, error: patientsError } = usePatients();

  const {
    selectedDateFrom,
    setSelectedDateFrom,
    selectedDateTo,
    setSelectedDateTo,
    selectedPatientName,
    setSelectedPatientName,
    selectedPractice,
    setSelectedPractice,
    selectedObraSocial,
    setSelectedObraSocial,
    selectedInstitucion,
    setSelectedInstitucion
  } = useFilters();

  const convertToISO = (date: string): string => {
    if (!date) return "";
    if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
      const [d, m, y] = date.split("/");
      return `${y}-${m}-${d}`;
    }
    const parsed = new Date(date);
    if (!isNaN(parsed.getTime())) return parsed.toISOString().split("T")[0];
    return "";
  };

  const parsePatientDateToISO = (raw?: unknown): string => {
    if (typeof raw !== "string") return "";
    const trimmed = raw.trim();
    if (!trimmed) return "";
    if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.split("T")[0];
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
      const [d, m, y] = trimmed.split("/");
      return `${y}-${m}-${d}`;
    }
    const parsed = new Date(trimmed);
    if (!isNaN(parsed.getTime())) return parsed.toISOString().split("T")[0];
    return "";
  };

  const addPatient = (newPatient: Patient) => {
    setPatients((prev) => {
      const list = Array.isArray(prev) ? prev : [];
      return [...list, newPatient];
    });
    alert("Paciente agregado con éxito");
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients((prev) =>
      (Array.isArray(prev) ? prev : []).map((p) =>
        p.id === updatedPatient.id ? updatedPatient : p
      )
    );
    alert("Paciente editado correctamente");
  };

  const deletePatient = async (patientId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/paciente/${patientId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!response.ok) throw new Error("Error al eliminar");

      setPatients((prev) => (Array.isArray(prev) ? prev : []).filter((p) => p.id !== patientId));
      alert("Paciente eliminado");
    } catch {
      alert("Hubo un error al borrar el paciente.");
    }
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowEditModal(true);
  };

  const dataToFilter = Array.isArray(patients) ? patients : [];

  const fromISO = convertToISO(selectedDateFrom);
  const toISO = convertToISO(selectedDateTo);

  const filteredPatients = dataToFilter.filter((p) => {
    const patientISO = parsePatientDateToISO((p as Patient).dia);
    if (!patientISO) return false;
    const afterFrom = fromISO ? patientISO >= fromISO : true;
    const beforeTo = toISO ? patientISO <= toISO : true;

    const pacienteValue = typeof p.paciente === "string" ? p.paciente : "";
    const practicasValue = typeof p.practicas === "string" ? p.practicas : "";
    const obraSocialValue = typeof p.obraSocial === "string" ? p.obraSocial : "";
    const institucionValue = typeof p.institucion === "string" ? p.institucion : "";

    const matchName = selectedPatientName ? pacienteValue.toLowerCase().includes(selectedPatientName.toLowerCase()) : true;
    const matchPractice = selectedPractice ? practicasValue.toLowerCase().includes(selectedPractice.toLowerCase()) : true;
    const matchOS = selectedObraSocial ? obraSocialValue.toLowerCase().includes(selectedObraSocial.toLowerCase()) : true;
    const matchInst = selectedInstitucion ? institucionValue.toLowerCase().includes(selectedInstitucion.toLowerCase()) : true;

    return afterFrom && beforeTo && matchName && matchPractice && matchOS && matchInst;
  });

  return (
    <div className="flex flex-col flex-1 p-8">
      <h1 className="text-center text-2xl font-semibold mb-6 text-gray-50">
        Agenda de Turnos
      </h1>

      <FilterForm
        selectedDateFrom={selectedDateFrom}
        setSelectedDateFrom={setSelectedDateFrom}
        selectedDateTo={selectedDateTo}
        setSelectedDateTo={setSelectedDateTo}
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

      {patientsError && (
        <div className="text-red-500 text-center mt-4">
          Error al cargar pacientes: {patientsError}
        </div>
      )}

      <div className="mt-4">
        <PatientTable
          filteredPatients={filteredPatients}
          onEditClick={handleEditPatient}
          onDeleteClick={deletePatient}
        />
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
