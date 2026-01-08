"use client";

import React from "react";
import { Patient, User } from "../../components/interfaz/interfaz";
import AddPatientModal from "../../components/Modals/AddPatientModal";
import EditPatientModal from "../../components/Modals/EditPatientModal";
import FilterForm from "../../components/FilterForm/FilterForm";
import PatientTable from "../../components/PatientTable/PatientTable";
import { usePrincipalLogic } from "../../hooks/PrincipalContent/usePrincipalLogic";
import { usePatientFilters } from "../../hooks/PrincipalContent/usePatientFilters";
import { NotificationModal } from "./Modals/NotificationModal";
import { ConfirmDeleteModal } from "./Modals/ConfirmDeleteModal";

interface PrincipalContentProps {
    user: User;
    showAddModal: boolean;
    setShowAddModal: (s: boolean) => void;
    showEditModal: boolean;
    setShowEditModal: (s: boolean) => void;
    selectedPatient: Patient | null;
    setSelectedPatient: (p: Patient | null) => void;
}

export default function PrincipalContent({
    user,
    showAddModal,
    setShowAddModal,
    showEditModal,
    setShowEditModal,
    selectedPatient,
    setSelectedPatient
}: PrincipalContentProps) {
    const {
        patients,
        setPatients,
        patientsError,
        notification,
        closeNotification,
        deleteConfirm,
        setDeleteConfirm,
        addPatient,
        updatePatient,
        deletePatient,
        handleConfirmDelete,
        handleEditPatient
    } = usePrincipalLogic(setShowAddModal, setShowEditModal, setSelectedPatient);

    const {
        filteredPatients,
        dataToFilter,
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
        setSelectedInstitucion,
        selectedStatus,
        setSelectedStatus
    } = usePatientFilters(patients);

    return (
        <div className="flex flex-col flex-1 p-4 md:p-8 w-full max-w-full overflow-x-hidden">
            <h1 className="text-center text-xl md:text-2xl font-semibold mb-6 text-gray-50">Agenda de Turnos</h1>
            
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
                selectedStatus={selectedStatus}
                setSelectedStatus={setSelectedStatus}
                patients={dataToFilter}
            />

            {patientsError && (
                <div className="text-red-500 text-center mt-4 text-sm md:text-base">
                    Error al cargar pacientes
                </div>
            )}

            <div className="mt-4 w-full">
                <PatientTable
                    filteredPatients={filteredPatients}
                    onEditClick={handleEditPatient}
                    onDeleteClick={handleConfirmDelete}
                    setPatients={setPatients}
                />
            </div>

            {showAddModal && user && (
                <AddPatientModal
                    user={user}
                    onClose={() => setShowAddModal(false)}
                    onAdd={addPatient}
                    existingPatients={dataToFilter}
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

            <ConfirmDeleteModal 
                show={deleteConfirm.show} 
                onClose={() => setDeleteConfirm({ show: false, id: null })} 
                onConfirm={deletePatient} 
            />

            <NotificationModal 
                notification={notification} 
                onClose={closeNotification} 
            />
        </div>
    );
}