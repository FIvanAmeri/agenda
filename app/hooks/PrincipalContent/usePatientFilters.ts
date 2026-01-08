"use client";

import { useMemo } from "react";
import { Patient } from "../../components/interfaz/interfaz";
import { useFilters } from "../useFilters";

export const usePatientFilters = (patients: Patient[]) => {
    const filters = useFilters();

    const convertToISO = (date: string): string => {
        if (!date) return "";
        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(date)) {
            const [d, m, y] = date.split("/");
            return `${y}-${m}-${d}`;
        }
        const parsed: Date = new Date(date);
        if (!isNaN(parsed.getTime())) return parsed.toISOString().split("T")[0];
        return "";
    };

    const parsePatientDateToISO = (raw?: string | null): string => {
        if (!raw) return "";
        const trimmed: string = raw.trim();
        if (/^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.split("T")[0];
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
            const [d, m, y] = trimmed.split("/");
            return `${y}-${m}-${d}`;
        }
        const parsed: Date = new Date(trimmed);
        if (!isNaN(parsed.getTime())) return parsed.toISOString().split("T")[0];
        return "";
    };

    const filteredPatients: Patient[] = useMemo(() => {
        const dataToFilter: Patient[] = Array.isArray(patients) ? patients : [];
        const fromISO: string = convertToISO(filters.selectedDateFrom);
        const toISO: string = convertToISO(filters.selectedDateTo);

        return dataToFilter.filter((p: Patient) => {
            const patientISO: string = parsePatientDateToISO(p.dia);
            if (!patientISO) return false;

            const afterFrom: boolean = fromISO ? patientISO >= fromISO : true;
            const beforeTo: boolean = toISO ? patientISO <= toISO : true;
            const matchName: boolean = filters.selectedPatientName 
                ? (p.paciente || "").toLowerCase().includes(filters.selectedPatientName.toLowerCase()) 
                : true;
            
            const matchStatus: boolean = filters.selectedStatus === "" 
                ? true 
                : filters.selectedStatus === "Pagado" 
                    ? p.estadoPago === "pagado" 
                    : p.estadoPago === "no pagado" || p.estadoPago === "parcialmente pagado";
            
            const matchPractice: boolean = filters.selectedPractice 
                ? (p.practicas || "").toLowerCase().includes(filters.selectedPractice.toLowerCase()) 
                : true;
            const matchObraSocial: boolean = filters.selectedObraSocial 
                ? (p.obraSocial || "").toLowerCase().includes(filters.selectedObraSocial.toLowerCase()) 
                : true;
            const matchInstitucion: boolean = filters.selectedInstitucion 
                ? (p.institucion || "").toLowerCase().includes(filters.selectedInstitucion.toLowerCase()) 
                : true;
            
            return afterFrom && beforeTo && matchName && matchStatus && matchPractice && matchObraSocial && matchInstitucion;
        });
    }, [patients, filters]);

    return {
        ...filters,
        filteredPatients,
        dataToFilter: Array.isArray(patients) ? patients : []
    };
};