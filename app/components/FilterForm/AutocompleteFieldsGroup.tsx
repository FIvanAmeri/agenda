"use client";

import React from "react";
import AutocompleteInput from "./AutocompleteInput";
import { AUTOCOMPLETE_FIELDS_CONFIG } from "./FilterFieldsConfig";
import { FiltrosCirugia } from "../../components/interfaz/tipos-cirugia";
import { DropdownStates, FilterFieldKey, ShowSetters } from "../../hooks/Cirugia/useFilterDropdowns.types";

interface Props {
    filters: FiltrosCirugia;
    showStates: DropdownStates;
    showSetters: ShowSetters;
    suggestions: {
        patient: string[];
        practice: string[];
        institucion: string[];
        obraSocial: string[];
    };
    handleFilterChange: (key: keyof FiltrosCirugia, value: string) => void;
    handleOpen: (field: FilterFieldKey) => void;
    handleSuggestionClick: (name: string, key: keyof FiltrosCirugia) => void;
}

export const AutocompleteFieldsGroup: React.FC<Props> = ({
    filters,
    showStates,
    showSetters,
    suggestions,
    handleFilterChange,
    handleOpen,
    handleSuggestionClick
}) => {
    return (
        <>
            {AUTOCOMPLETE_FIELDS_CONFIG.map((field) => (
                <AutocompleteInput
                    key={field.fieldKey}
                    label={field.label}
                    value={filters[field.valueKey] as string}
                    setValue={(val: string) => handleFilterChange(field.valueKey, val)}
                    fieldKey={field.fieldKey}
                    filteredNames={suggestions[field.fieldKey]}
                    placeholder={field.placeholder}
                    dataTestId={field.testId}
                    isShowing={showStates[field.fieldKey]}
                    setter={showSetters[field.fieldKey]}
                    handleOpen={handleOpen}
                    handleSuggestionClick={(name: string) => handleSuggestionClick(name, field.valueKey)}
                />
            ))}
        </>
    );
};