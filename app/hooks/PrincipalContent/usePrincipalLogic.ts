"use client";

import { useState } from "react";
import { Patient } from "../../components/interfaz/interfaz";
import usePatients from "../usePatients";

interface NotificationState {
    show: boolean;
    message: string;
    type: "success" | "error";
}

export const usePrincipalLogic = (
    setShowAddModal: (s: boolean) => void,
    setShowEditModal: (s: boolean) => void,
    setSelectedPatient: (p: Patient | null) => void
) => {
    const { patients, setPatients, loading: patientsLoading, error: patientsError } = usePatients();
    const [notification, setNotification] = useState<NotificationState>({ show: false, message: "", type: "success" });
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean, id: number | null }>({ show: false, id: null });

    const closeNotification = (): void => setNotification({ show: false, message: "", type: "success" });
    
    const displayNotification = (message: string, type: "success" | "error" = "success"): void => {
        setNotification({ show: true, message, type });
    };

    const addPatient = (newPatient: Patient): void => {
        setPatients((prev: Patient[]) => {
            const list: Patient[] = Array.isArray(prev) ? prev : [];
            return [...list, newPatient].sort((a: Patient, b: Patient) => {
                const dateA: number = new Date(a.dia).getTime();
                const dateB: number = new Date(b.dia).getTime();
                if (dateA !== dateB) return dateA - dateB;
                return a.hora.localeCompare(b.hora);
            });
        });
        displayNotification("Turno agregado exitosamente.", "success");
        setShowAddModal(false);
    };

    const updatePatient = (updatedPatient: Patient): void => {
        setPatients((prev: Patient[]) => {
            const list: Patient[] = Array.isArray(prev) ? prev : [];
            return list.map((p: Patient) => p.id === updatedPatient.id ? updatedPatient : p)
                .sort((a: Patient, b: Patient) => {
                    const dateA: number = new Date(a.dia).getTime();
                    const dateB: number = new Date(b.dia).getTime();
                    if (dateA !== dateB) return dateA - dateB;
                    return a.hora.localeCompare(b.hora);
                });
        });
        displayNotification("Cambios guardados con éxito.", "success");
        setShowEditModal(false);
    };

    const deletePatient = async (): Promise<void> => {
        if (deleteConfirm.id === null) return;
        const patientId: number = deleteConfirm.id;
        const token: string | null = localStorage.getItem("token");

        try {
            const response: Response = await fetch(`/api/pacientes/${patientId}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData: { message?: string } = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Error en el servidor");
            }

            setPatients((prev: Patient[]) => (Array.isArray(prev) ? prev : []).filter((p: Patient) => p.id !== patientId));
            displayNotification("Paciente eliminado de la agenda.", "success");
        } catch (err: unknown) {
            const errorMessage: string = err instanceof Error ? err.message : "No se pudo eliminar el paciente.";
            displayNotification(`Error: ${errorMessage}`, "error");
        } finally {
            setDeleteConfirm({ show: false, id: null });
        }
    };

    const handleConfirmDelete = (id: number): void => {
        setDeleteConfirm({ show: true, id });
    };

    const handleEditPatient = (patient: Patient): void => {
        setSelectedPatient(patient);
        setShowEditModal(true);
    };

    return {
        patients,
        setPatients,
        patientsLoading,
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
    };
};