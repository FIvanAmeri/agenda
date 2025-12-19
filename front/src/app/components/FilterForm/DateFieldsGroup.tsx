"use client";

import React from "react";
import { FilterDateInput } from "./FilterDateInput";
import { FiltrosCirugia } from "../../components/interfaz/tipos-cirugia";
import { parseDatePickerValue } from "../../utils/dateUtils";

interface Props {
    filters: FiltrosCirugia;
    onFilterChange: (key: keyof FiltrosCirugia, value: string) => void;
}

export const DateFieldsGroup: React.FC<Props> = ({ filters, onFilterChange }) => {
    return (
        <>
            <FilterDateInput 
                label="Desde" 
                value={filters.dateFrom} 
                onChange={(d) => onFilterChange("dateFrom", parseDatePickerValue(d))} 
            />
            <FilterDateInput 
                label="Hasta" 
                value={filters.dateTo} 
                onChange={(d) => onFilterChange("dateTo", parseDatePickerValue(d))} 
            />
        </>
    );
};