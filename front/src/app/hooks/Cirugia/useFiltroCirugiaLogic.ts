import { useMemo, useCallback } from "react";
import { FiltrosCirugia } from "../../components/interfaz/tipos-cirugia";
import { useCirugiaLists } from "../../hooks/Cirugia/useCirugiaLists";
import { Cirugia } from "../../components/interfaz/interfaz";

export const useFiltroCirugiaLogic = (
    filters: FiltrosCirugia,
    setFilters: React.Dispatch<React.SetStateAction<FiltrosCirugia>>,
    cirugias: Cirugia[],
    obrasSocialesOpciones: string[],
    closeAllDropdowns: () => void
) => {
    const { patientNames, tiposCirugia, medicos } = useCirugiaLists(cirugias);

    const handleFilterChange = useCallback((field: keyof FiltrosCirugia, value: string): void => {
        setFilters((prev: FiltrosCirugia) => ({ ...prev, [field]: value }));
    }, [setFilters]);

    const filteredPatients = useMemo(() => 
        patientNames.filter((name: string) => 
            name.toLowerCase().includes(filters.selectedPatientName.toLowerCase())
        ), [patientNames, filters.selectedPatientName]);

    const filteredPractices = useMemo(() => 
        tiposCirugia.filter((name: string) => 
            name.toLowerCase().includes(filters.selectedTipoCirugia.toLowerCase())
        ), [tiposCirugia, filters.selectedTipoCirugia]);

    const filteredMedicos = useMemo(() => 
        medicos.filter((name: string) => 
            name.toLowerCase().includes(filters.selectedMedico.toLowerCase())
        ), [medicos, filters.selectedMedico]);

    const filteredObrasSociales = useMemo(() => 
        obrasSocialesOpciones.filter((name: string) => 
            name.toLowerCase().includes(filters.selectedObraSocial.toLowerCase())
        ), [obrasSocialesOpciones, filters.selectedObraSocial]);

    const handleSuggestionClick = useCallback((
        name: string,
        field: keyof FiltrosCirugia
    ): void => {
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