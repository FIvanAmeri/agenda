"use client";

import React from "react";
import { FaFilter, FaRedo } from "react-icons/fa";
import AutocompleteInput from "./AutocompleteInput";
import { useFilterDropdowns, FilterFieldKey } from "../../hooks/Filtro/useFilterDropdowns";
import { PropsFiltroCirugia } from "../../components/interfaz/tipos-cirugia";
import { useFiltroCirugiaLogic } from "../../hooks/Cirugia/useFiltroCirugiaLogic";
import { FilterDateInput } from "./FilterDateInput";
import { parseDatePickerValue } from "../../utils/dateUtils";

const FiltroCirugiaForm: React.FC<PropsFiltroCirugia> = ({
    filters,
    setFilters,
    cirugias,
    obrasSocialesOpciones,
    medicosOpciones,
    tiposCirugiaOpciones
}) => {
    const { formRef, showStates, showSetters, closeAllDropdowns, handleOpen } = useFilterDropdowns();

    const {
        handleFilterChange,
        handleSuggestionClick,
        handleResetFilters,
        filteredPatients,
        filteredPractices,
        filteredMedicos,
        filteredObrasSociales
    } = useFiltroCirugiaLogic(
        filters, 
        setFilters, 
        cirugias, 
        obrasSocialesOpciones, 
        medicosOpciones, 
        tiposCirugiaOpciones, 
        closeAllDropdowns
    );

    return (
        <div ref={formRef} className="bg-gray-800 p-4 md:p-5 rounded-xl shadow-2xl w-full">
            <div className="flex items-center mb-4 text-white border-b border-gray-600 pb-3">
                <FaFilter className="mr-3 text-cyan-400 text-lg md:text-xl" />
                <h3 className="font-extrabold text-lg md:text-xl tracking-wide">Filtros de Cirugías</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 items-end">
                <FilterDateInput 
                    label="Desde" 
                    value={filters.dateFrom} 
                    onChange={(d: Date | null): void => handleFilterChange("dateFrom", parseDatePickerValue(d))} 
                />
                
                <FilterDateInput 
                    label="Hasta" 
                    value={filters.dateTo} 
                    onChange={(d: Date | null): void => handleFilterChange("dateTo", parseDatePickerValue(d))} 
                />

                <AutocompleteInput
                    label="Paciente"
                    value={filters.selectedPatientName}
                    setValue={(val: string): void => handleFilterChange("selectedPatientName", val)}
                    fieldKey={"patient" as FilterFieldKey}
                    filteredNames={filteredPatients}
                    placeholder="Paciente..."
                    dataTestId="filter-paciente"
                    isShowing={showStates.patient}
                    setter={showSetters.patient}
                    handleOpen={handleOpen}
                    handleSuggestionClick={(name: string): void => handleSuggestionClick(name, "selectedPatientName")}
                />

                <AutocompleteInput
                    label="Tipo Cirugía"
                    value={filters.selectedTipoCirugia}
                    setValue={(val: string): void => handleFilterChange("selectedTipoCirugia", val)}
                    fieldKey={"practice" as FilterFieldKey}
                    filteredNames={filteredPractices}
                    placeholder="Tipo..."
                    dataTestId="filter-tipo-cirugia"
                    isShowing={showStates.practice}
                    setter={showSetters.practice}
                    handleOpen={handleOpen}
                    handleSuggestionClick={(name: string): void => handleSuggestionClick(name, "selectedTipoCirugia")}
                />

                <AutocompleteInput
                    label="Médico"
                    value={filters.selectedMedico}
                    setValue={(val: string): void => handleFilterChange("selectedMedico", val)}
                    fieldKey={"institucion" as FilterFieldKey}
                    filteredNames={filteredMedicos}
                    placeholder="Médico..."
                    dataTestId="filter-medico"
                    isShowing={showStates.institucion}
                    setter={showSetters.institucion}
                    handleOpen={handleOpen}
                    handleSuggestionClick={(name: string): void => handleSuggestionClick(name, "selectedMedico")}
                />
                
                <AutocompleteInput
                    label="Obra Social"
                    value={filters.selectedObraSocial}
                    setValue={(val: string): void => handleFilterChange("selectedObraSocial", val)}
                    fieldKey={"obraSocial" as FilterFieldKey}
                    filteredNames={filteredObrasSociales}
                    placeholder="OS..."
                    dataTestId="filter-obra-social"
                    isShowing={showStates.obraSocial}
                    setter={showSetters.obraSocial}
                    handleOpen={handleOpen}
                    handleSuggestionClick={(name: string): void => handleSuggestionClick(name, "selectedObraSocial")}
                />
                
                <div className="flex flex-col w-full">
                    <label className="text-xs font-medium text-gray-400 mb-1">Estado Pago</label>
                    <div className="relative">
                        <select
                            value={filters.selectedStatus}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>): void => handleFilterChange("selectedStatus", e.target.value)}
                            className="p-2 border border-gray-600 bg-white rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner w-full h-10 appearance-none pr-8"
                        >
                            <option value="">Todos</option>
                            <option value="pagado">Pagado</option>
                            <option value="parcialmente pagado">Parcial</option>
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