import { useMemo, useCallback } from "react";
import { FiltrosCirugia } from "../../components/interfaz/tipos-cirugia";
import { Cirugia } from "../../components/interfaz/interfaz";

export const useFiltroCirugiaLogic = (
    filters: FiltrosCirugia,
    setFilters: React.Dispatch<React.SetStateAction<FiltrosCirugia>>,
    cirugias: Cirugia[] = [],
    obrasSocialesOpciones: string[] = [],
    medicosOpciones: string[] = [],
    tiposCirugiaOpciones: string[] = [],
    closeAllDropdowns: () => void
) => {
    const handleFilterChange = useCallback((field: keyof FiltrosCirugia, value: string): void => {
        setFilters((prev: FiltrosCirugia) => ({ ...prev, [field]: value }));
    }, [setFilters]);

    const filteredPatients = useMemo((): string[] => {
        const data = Array.isArray(cirugias) ? cirugias : [];
        const unique = Array.from(new Set(data.map((c: Cirugia) => c.paciente)));
        return unique.filter((n: string) => n.toLowerCase().includes((filters.selectedPatientName || "").toLowerCase()));
    }, [cirugias, filters.selectedPatientName]);

    const filteredPractices = useMemo((): string[] => {
        const data = Array.isArray(tiposCirugiaOpciones) ? tiposCirugiaOpciones : [];
        return data.filter((n: string) => n.toLowerCase().includes((filters.selectedTipoCirugia || "").toLowerCase()));
    }, [tiposCirugiaOpciones, filters.selectedTipoCirugia]);

    const filteredMedicos = useMemo((): string[] => {
        const data = Array.isArray(medicosOpciones) ? medicosOpciones : [];
        return data.filter((n: string) => n.toLowerCase().includes((filters.selectedMedico || "").toLowerCase()));
    }, [medicosOpciones, filters.selectedMedico]);

    const filteredObrasSociales = useMemo((): string[] => {
        const data = Array.isArray(obrasSocialesOpciones) ? obrasSocialesOpciones : [];
        return data.filter((n: string) => n.toLowerCase().includes((filters.selectedObraSocial || "").toLowerCase()));
    }, [obrasSocialesOpciones, filters.selectedObraSocial]);

    const handleSuggestionClick = useCallback((name: string, field: keyof FiltrosCirugia): void => {
        setFilters((prev: FiltrosCirugia) => ({ ...prev, [field]: name }));
        closeAllDropdowns();
    }, [setFilters, closeAllDropdowns]);

    const handleResetFilters = (): void => {
        setFilters({
            dateFrom: "",
            dateTo: "",
            selectedPatientName: "",
            selectedTipoCirugia: "",
            selectedMedico: "",
            selectedStatus: "",
            selectedObraSocial: "",
        });
        closeAllDropdowns();
    };

    return {
        handleFilterChange,
        handleSuggestionClick,
        handleResetFilters,
        filteredPatients,
        filteredPractices,
        filteredMedicos,
        filteredObrasSociales
    };
};