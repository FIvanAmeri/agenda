import { useMemo, useCallback } from "react";
import { FiltrosCirugia } from "../../components/interfaz/tipos-cirugia";
import { Cirugia } from "../../components/interfaz/interfaz";

interface UseFiltroCirugiaLogicArgs {
    filters: FiltrosCirugia;
    setFilters: React.Dispatch<React.SetStateAction<FiltrosCirugia>>;
    cirugias: Cirugia[];
    obrasSocialesOpciones: string[];
    medicosOpciones: string[];
    tiposCirugiaOpciones: string[];
    closeAllDropdowns: () => void;
}

export const useFiltroCirugiaLogic = ({
    filters,
    setFilters,
    cirugias,
    obrasSocialesOpciones,
    medicosOpciones,
    tiposCirugiaOpciones,
    closeAllDropdowns
}: UseFiltroCirugiaLogicArgs) => {
    
    const handleFilterChange = useCallback((field: keyof FiltrosCirugia, value: string): void => {
        setFilters((prev: FiltrosCirugia) => ({ ...prev, [field]: value }));
    }, [setFilters]);

    const filteredPatients = useMemo((): string[] => {
        const unique = Array.from(new Set(cirugias.map((c: Cirugia) => c.paciente)));
        return unique.filter((n: string) => n.toLowerCase().includes((filters.selectedPatientName || "").toLowerCase()));
    }, [cirugias, filters.selectedPatientName]);

    const filteredPractices = useMemo((): string[] => {
        return tiposCirugiaOpciones.filter((n: string) => n.toLowerCase().includes((filters.selectedTipoCirugia || "").toLowerCase()));
    }, [tiposCirugiaOpciones, filters.selectedTipoCirugia]);

    const filteredMedicos = useMemo((): string[] => {
        return medicosOpciones.filter((n: string) => n.toLowerCase().includes((filters.selectedMedico || "").toLowerCase()));
    }, [medicosOpciones, filters.selectedMedico]);

    const filteredObrasSociales = useMemo((): string[] => {
        return obrasSocialesOpciones.filter((n: string) => n.toLowerCase().includes((filters.selectedObraSocial || "").toLowerCase()));
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