"use client";

import React, { useMemo, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaFilter, FaRedo } from "react-icons/fa";
import AutocompleteInput from "../FilterForm/AutocompleteInput";
import { useFilterDropdowns, FilterFieldKey } from "../../hooks/Filtro/useFilterDropdowns";
import { useCirugiaLists } from "../../hooks/Cirugia/useCirugiaLists";
import { PropsFiltroCirugia, FiltrosCirugia } from "../../components/interfaz/tipos-cirugia";

const formatISO = (date: Date | null): string => {
    if (!date) return "";
    const d: string = date.getDate().toString().padStart(2, "0");
    const m: string = (date.getMonth() + 1).toString().padStart(2, "0");
    const y: number = date.getFullYear();
    return `${y}-${m}-${d}`;
};

const parseISO = (iso: string): Date | null => {
    if (!iso) return null;
    const parts: string[] = iso.split("-");
    if (parts.length !== 3) return new Date(iso);
    const y: number = Number(parts[0]);
    const m: number = Number(parts[1]) - 1;
    const d: number = Number(parts[2]);
    return new Date(y, m, d);
};

const parseDatePickerValue = (date: Date | null): string => {
    return formatISO(date);
};

const FiltroCirugiaForm: React.FC<PropsFiltroCirugia> = ({
    filters,
    setFilters,
    cirugias,
    obrasSocialesOpciones,
}) => {
    const { formRef, showStates, showSetters, closeAllDropdowns, handleOpen } =
        useFilterDropdowns();

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

    return (
        <div ref={formRef} className="bg-gray-800 p-4 md:p-5 rounded-xl shadow-2xl w-full">
            <div className="flex items-center mb-4 text-white border-b border-gray-600 pb-3">
                <FaFilter className="mr-3 text-cyan-400 text-lg md:text-xl" />
                <h3 className="font-extrabold text-lg md:text-xl tracking-wide">Filtros de Cirugías</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 items-end">
                <div className="flex flex-col w-full">
                    <label className="text-xs font-medium text-gray-400 mb-1">Desde</label>
                    <DatePicker
                        selected={parseISO(filters.dateFrom)}
                        onChange={(d: Date | null) => handleFilterChange("dateFrom", parseDatePickerValue(d))}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="DD/MM/AAAA"
                        className="p-2 border border-gray-600 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner w-full h-10"
                        wrapperClassName="w-full"
                    />
                </div>

                <div className="flex flex-col w-full">
                    <label className="text-xs font-medium text-gray-400 mb-1">Hasta</label>
                    <DatePicker
                        selected={parseISO(filters.dateTo)}
                        onChange={(d: Date | null) => handleFilterChange("dateTo", parseDatePickerValue(d))}
                        dateFormat="dd/MM/yyyy"
                        placeholderText="DD/MM/AAAA"
                        className="p-2 border border-gray-600 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner w-full h-10"
                        wrapperClassName="w-full"
                    />
                </div>

                <div className="flex flex-col w-full">
                    <AutocompleteInput
                        label="Paciente"
                        value={filters.selectedPatientName}
                        setValue={(val: string) => handleFilterChange("selectedPatientName", val)}
                        fieldKey={"patient" as FilterFieldKey}
                        filteredNames={filteredPatients}
                        placeholder="Paciente..."
                        dataTestId="filter-paciente"
                        isShowing={showStates.patient}
                        setter={showSetters.patient}
                        handleOpen={handleOpen}
                        handleSuggestionClick={(name: string) => handleSuggestionClick(name, "selectedPatientName")}
                    />
                </div>

                <div className="flex flex-col w-full">
                    <AutocompleteInput
                        label="Tipo Cirugía"
                        value={filters.selectedTipoCirugia}
                        setValue={(val: string) => handleFilterChange("selectedTipoCirugia", val)}
                        fieldKey={"practice" as FilterFieldKey}
                        filteredNames={filteredPractices}
                        placeholder="Tipo..."
                        dataTestId="filter-tipo-cirugia"
                        isShowing={showStates.practice}
                        setter={showSetters.practice}
                        handleOpen={handleOpen}
                        handleSuggestionClick={(name: string) => handleSuggestionClick(name, "selectedTipoCirugia")}
                    />
                </div>

                <div className="flex flex-col w-full">
                    <AutocompleteInput
                        label="Médico"
                        value={filters.selectedMedico}
                        setValue={(val: string) => handleFilterChange("selectedMedico", val)}
                        fieldKey={"institucion" as FilterFieldKey}
                        filteredNames={filteredMedicos}
                        placeholder="Médico..."
                        dataTestId="filter-medico"
                        isShowing={showStates.institucion}
                        setter={showSetters.institucion}
                        handleOpen={handleOpen}
                        handleSuggestionClick={(name: string) => handleSuggestionClick(name, "selectedMedico")}
                    />
                </div>
                
                <div className="flex flex-col w-full">
                    <AutocompleteInput
                        label="Obra Social"
                        value={filters.selectedObraSocial}
                        setValue={(val: string) => handleFilterChange("selectedObraSocial", val)}
                        fieldKey={"obraSocial" as FilterFieldKey}
                        filteredNames={filteredObrasSociales}
                        placeholder="OS..."
                        dataTestId="filter-obra-social"
                        isShowing={showStates.obraSocial}
                        setter={showSetters.obraSocial}
                        handleOpen={handleOpen}
                        handleSuggestionClick={(name: string) => handleSuggestionClick(name, "selectedObraSocial")}
                    />
                </div>
                
                <div className="flex flex-col w-full">
                    <label className="text-xs font-medium text-gray-400 mb-1">Estado Pago</label>
                    <div className="relative">
                        <select
                            value={filters.selectedStatus}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange("selectedStatus", e.target.value)}
                            className="p-2 border border-gray-600 bg-white rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner w-full h-10 appearance-none pr-8"
                        >
                            <option value="" disabled hidden>Opción</option>
                            <option value="pagado">Pagado</option>
                            <option value="no pagado">No Pagado</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>
                </div>
        
                <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex items-center justify-center p-2 h-10 w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 transform hover:scale-[1.02] sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1"
                >
                    <FaRedo className="mr-1" />
                    Limpiar
                </button>
            </div>
        </div>
    );
};

export default FiltroCirugiaForm;