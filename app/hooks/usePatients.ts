"use client";

import { useState, useEffect, useCallback } from "react";
import { Patient } from "../components/interfaz/interfaz";
import { useAuth } from "../context/AuthContext";
import api from "@/app/services/api";

interface UsePatientsResult {
    patients: Patient[];
    setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
    loading: boolean;
    error: string | null;
    deletePatient: (id: number) => Promise<void>;
}

export default function usePatients(): UsePatientsResult {
    const { token } = useAuth();
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPatients = useCallback(async () => {
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

          
            const { data } = await api.get("/pacientes");

            const listaPacientes = data.pacientes || data || [];
            setPatients(Array.isArray(listaPacientes) ? listaPacientes : []);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar pacientes");
            setPatients([]);
        } finally {
            setLoading(false);
        }
    }, [token]);

    useEffect(() => {
        fetchPatients();
    }, [fetchPatients]);

    const deletePatient = useCallback(async (id: number) => {
        if (!token) return;
        try {
            await api.delete(`/pacientes/${id}`);
            setPatients((prev) => prev.filter((p) => p.id !== id));
        } catch (err) {
            const message = err instanceof Error ? err.message : "Error al eliminar paciente";
            setError(message);
            throw err;
        }
    }, [token]);

    return {
        patients,
        setPatients,
        loading,
        error,
        deletePatient,
    };
}