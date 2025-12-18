"use client";

import React, { useState } from "react";
import { Patient, User } from "../../components/interfaz/interfaz";
import AddPatientModal from "../../components/Modals/AddPatientModal";
import EditPatientModal from "../../components/Modals/EditPatientModal";
import FilterForm from "../../components/FilterForm/FilterForm";
import PatientTable from "../../components/PatientTable/PatientTable";
import usePatients from "../../hooks/usePatients";
import { useFilters } from "../../hooks/useFilters";

interface NotificationState {
    show: boolean;
    message: string;
    type: 'success' | 'error';
}

const NotificationModal: React.FC<{ notification: NotificationState, onClose: () => void }> = ({ notification, onClose }) => {
    if (!notification.show) return null;
    const bgColor = notification.type === 'success' ? 'bg-[#004d40]' : 'bg-red-700';
    const borderColor = notification.type === 'success' ? 'border-[#009688]' : 'border-red-500';
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-[100] flex justify-center items-center p-4" onClick={onClose}>
            <div className={`w-full max-w-md p-6 rounded-lg shadow-2xl text-white border-2 ${bgColor} ${borderColor}`} onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{notification.type === 'success' ? 'Operación Exitosa' : 'Error'}</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-300 text-2xl leading-none">&times;</button>
                </div>
                <p className="text-lg mb-6">{notification.message}</p>
                <div className="flex justify-end">
                    <button onClick={onClose} className={`px-6 py-2 rounded-md font-semibold ${notification.type === 'success' ? 'bg-[#009688] hover:bg-[#00796b]' : 'bg-red-500 hover:bg-red-600'} transition duration-200`}>Aceptar</button>
                </div>
            </div>
        </div>
    );
};

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
    const [notification, setNotification] = useState<NotificationState>({ show: false, message: '', type: 'success' });
    const closeNotification = () => setNotification({ show: false, message: '', type: 'success' });
    const displayNotification = (message: string, type: 'success' | 'error' = 'success') => {
        setNotification({ show: true, message, type });
    };

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
        setSelectedInstitucion,
        selectedStatus,
        setSelectedStatus
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

    const parsePatientDateToISO = (raw?: string | null): string => {
        if (!raw) return "";
        const trimmed = raw.trim();
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
            return [...list, newPatient].sort((a, b) => {
                const dateA = new Date(a.dia).getTime();
                const dateB = new Date(b.dia).getTime();
                if (dateA !== dateB) return dateA - dateB;
                return a.hora.localeCompare(b.hora);
            });
        });
        displayNotification("Turno agregado exitosamente.", 'success');
        setShowAddModal(false);
    };

    const updatePatient = (updatedPatient: Patient) => {
        setPatients((prev) => {
            const list = Array.isArray(prev) ? prev : [];
            return list.map((p) => p.id === updatedPatient.id ? updatedPatient : p)
                .sort((a, b) => {
                    const dateA = new Date(a.dia).getTime();
                    const dateB = new Date(b.dia).getTime();
                    if (dateA !== dateB) return dateA - dateB;
                    return a.hora.localeCompare(b.hora);
                });
        });
        displayNotification("Cambios guardados con éxito.", 'success');
        setShowEditModal(false);
    };

    const deletePatient = async (patientId: number) => {
        try {
            const response = await fetch(`http://localhost:3001/api/paciente/${patientId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            if (!response.ok) throw new Error();
            setPatients((prev) => (Array.isArray(prev) ? prev : []).filter((p) => p.id !== patientId));
            displayNotification("Paciente eliminado de la agenda.", 'success');
        } catch {
            displayNotification("Error: No se pudo eliminar el paciente.", 'error');
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
        const patientISO = parsePatientDateToISO(p.dia);
        if (!patientISO) return false;
        const afterFrom = fromISO ? patientISO >= fromISO : true;
        const beforeTo = toISO ? patientISO <= toISO : true;
        const matchName = selectedPatientName ? (p.paciente || "").toLowerCase().includes(selectedPatientName.toLowerCase()) : true;
        const matchStatus = selectedStatus === "" 
            ? true 
            : selectedStatus === "Pagado" 
                ? p.estadoPago === "pagado" 
                : p.estadoPago === "no pagado" || p.estadoPago === "parcialmente pagado";
        
        const matchPractice = selectedPractice ? (p.practicas || "").toLowerCase().includes(selectedPractice.toLowerCase()) : true;
        const matchObraSocial = selectedObraSocial ? (p.obraSocial || "").toLowerCase().includes(selectedObraSocial.toLowerCase()) : true;
        const matchInstitucion = selectedInstitucion ? (p.institucion || "").toLowerCase().includes(selectedInstitucion.toLowerCase()) : true;
        
        return afterFrom && beforeTo && matchName && matchStatus && matchPractice && matchObraSocial && matchInstitucion;
    });

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
            {patientsError && <div className="text-red-500 text-center mt-4 text-sm md:text-base">Error al cargar pacientes</div>}
            <div className="mt-4 w-full">
                <PatientTable
                    filteredPatients={filteredPatients}
                    onEditClick={handleEditPatient}
                    onDeleteClick={deletePatient}
                    setPatients={setPatients}
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
            <NotificationModal notification={notification} onClose={closeNotification} />
        </div>
    );
}