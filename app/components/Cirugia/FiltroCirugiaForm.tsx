"use client";

import React from "react";
import { useFilterDropdowns } from "../../hooks/Filtro/useFilterDropdowns";
import { PropsFiltroCirugia } from "../../components/interfaz/tipos-cirugia";
import { useFiltroCirugiaLogic } from "../../hooks/Cirugia/useFiltroCirugiaLogic";
import { FilterHeader } from "./FilterHeader";
import { FilterStatusSelect } from "./FilterStatusSelect";
import { FilterResetButton } from "./FilterResetButton";
import { AutocompleteFieldsGroup } from "../FilterForm/AutocompleteFieldsGroup";
import { DateFieldsGroup } from "../FilterForm/DateFieldsGroup";

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
    } = useFiltroCirugiaLogic({
        filters,
        setFilters,
        cirugias,
        obrasSocialesOpciones,
        medicosOpciones,
        tiposCirugiaOpciones,
        closeAllDropdowns
    });

    const suggestionsMap = {
        patient: filteredPatients,
        practice: filteredPractices,
        institucion: filteredMedicos,
        obraSocial: filteredObrasSociales
    };

    return (
        <div ref={formRef} className="bg-gray-800 p-4 md:p-5 rounded-xl shadow-2xl w-full">
            <FilterHeader />

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-4 items-end">
                <DateFieldsGroup 
                    filters={filters} 
                    onFilterChange={handleFilterChange} 
                />

                <AutocompleteFieldsGroup 
                    filters={filters}
                    showStates={showStates}
                    showSetters={showSetters}
                    suggestions={suggestionsMap}
                    handleFilterChange={handleFilterChange}
                    handleOpen={handleOpen}
                    handleSuggestionClick={handleSuggestionClick}
                />
                
                <FilterStatusSelect 
                    value={filters.selectedStatus} 
                    onChange={(val: string) => handleFilterChange("selectedStatus", val)} 
                />
        
                <FilterResetButton onClick={handleResetFilters} />
            </div>
        </div>
    );
};

export default FiltroCirugiaForm;