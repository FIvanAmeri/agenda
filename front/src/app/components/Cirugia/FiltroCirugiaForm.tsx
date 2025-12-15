"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaFilter, FaRedo } from "react-icons/fa";
import AutocompleteInput from "./AutocompleteInput";
import { useFilterDropdowns } from "../../hooks/Filtro/useFilterDropdowns";
import { useCirugiaLists } from "../../hooks/Cirugia/useCirugiaLists";
import { PropsFiltroCirugia, FiltrosCirugia } from "../../components/interfaz/tipos-cirugia";
import { FilterFieldKey } from "../../hooks/Filtro/useFilterDropdowns";

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

const filterSuggestions = (list: string[], value: string): string[] =>
    value ? list.filter((i: string) => i.toLowerCase().includes(value.toLowerCase())) : list;

const FiltroCirugiaForm: React.FC<PropsFiltroCirugia> = ({
    filters,
    setFilters,
    cirugias,
    medicosOpciones,
    tiposCirugiaOpciones,
    obrasSocialesOpciones,
}) => {
    const { formRef, showStates, closeAllDropdowns, handleOpen } =
        useFilterDropdowns();

    const { patientNames } = useCirugiaLists(cirugias);

    const handleFilterChange = (field: keyof FiltrosCirugia, value: string): void => {
        setFilters((prev: FiltrosCirugia) => ({ ...prev, [field]: value }));
    };

    const handleSuggestionClick = (
        name: string,
        field: keyof FiltrosCirugia
    ): void => {
        handleFilterChange(field, name);
        closeAllDropdowns();
    };

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
        <div ref={formRef} className="bg-gray-800 p-5 rounded-xl shadow-2xl">
            <div className="flex items-center mb-4 text-white border-b border-gray-600 pb-3">
                <FaFilter className="mr-3 text-cyan-400 text-xl" />
                <h3 className="font-extrabold text-xl tracking-wide">Filtros de Cirugías</h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-6 gap-4 items-end">
                
                <div className="flex flex-col">
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

        
                <div className="flex flex-col">
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

                <AutocompleteInput
                    label="Paciente"
                    value={filters.selectedPatientName}
                    setValue={(val: string) => handleFilterChange("selectedPatientName", val)}
                    fieldKey={"patient" as FilterFieldKey}
                    filteredNames={filterSuggestions(patientNames, filters.selectedPatientName)}
                    placeholder="Escriba o seleccione paciente..."
                    dataTestId="filter-paciente"
                    isShowing={showStates.patient}
                    handleOpen={handleOpen}
                    handleSuggestionClick={(name: string) => handleSuggestionClick(name, "selectedPatientName")}
                />

                <AutocompleteInput
                    label="Tipo Cirugía"
                    value={filters.selectedTipoCirugia}
                    setValue={(val: string) => handleFilterChange("selectedTipoCirugia", val)}
                    fieldKey={"tipoCirugia" as FilterFieldKey}
                    filteredNames={filterSuggestions(tiposCirugiaOpciones, filters.selectedTipoCirugia)}
                    placeholder="Escriba o seleccione tipo..."
                    dataTestId="filter-tipo-cirugia"
                    isShowing={showStates.tipoCirugia}
                    handleOpen={handleOpen}
                    handleSuggestionClick={(name: string) => handleSuggestionClick(name, "selectedTipoCirugia")}
                />

                <AutocompleteInput
                    label="Médico"
                    value={filters.selectedMedico}
                    setValue={(val: string) => handleFilterChange("selectedMedico", val)}
                    fieldKey={"medico" as FilterFieldKey}
                    filteredNames={filterSuggestions(medicosOpciones, filters.selectedMedico)}
                    placeholder="Escriba o seleccione médico..."
                    dataTestId="filter-medico"
                    isShowing={showStates.medico}
                    handleOpen={handleOpen}
                    handleSuggestionClick={(name: string) => handleSuggestionClick(name, "selectedMedico")}
                />
                
                <AutocompleteInput
                    label="Obra Social"
                    value={filters.selectedObraSocial}
                    setValue={(val: string) => handleFilterChange("selectedObraSocial", val)}
                    fieldKey={"obraSocial" as FilterFieldKey}
                    filteredNames={filterSuggestions(obrasSocialesOpciones, filters.selectedObraSocial)}
                    placeholder="Escriba o seleccione OS..."
                    dataTestId="filter-obra-social"
                    isShowing={showStates.obraSocial}
                    handleOpen={handleOpen}
                    handleSuggestionClick={(name: string) => handleSuggestionClick(name, "selectedObraSocial")}
                />
                
                <div className="flex flex-col">
                    <label className="text-xs font-medium text-gray-400 mb-1">Estado Pago</label>
                    <select
                        value={filters.selectedStatus}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange("selectedStatus", e.target.value as FiltrosCirugia["selectedStatus"])}
                        className="p-2 border border-gray-600 bg-white rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner w-full h-10 appearance-none pr-8"
                    >
                        <option value="" disabled hidden>Escoja una opción</option>
                        <option value="pagado">Pagado</option>
                        <option value="no pagado">No Pagado</option>
                    </select>
                </div>
        
                <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex items-center justify-center p-2 h-10 w-full mt-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 transform hover:scale-[1.02] col-span-2 sm:col-span-1 lg:col-span-2 xl:col-span-1"
                >
                    <FaRedo className="mr-1" />
                    Limpiar
                </button>
            </div>
        </div>
    );
};

export default FiltroCirugiaForm;