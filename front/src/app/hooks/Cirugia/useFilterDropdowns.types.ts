import { Dispatch, SetStateAction } from "react";

export interface DropdownStates {
    patient: boolean;
    practice: boolean;
    institucion: boolean;
    obraSocial: boolean;
}

export type FilterFieldKey = keyof DropdownStates;

export type ShowSetters = Record<FilterFieldKey, Dispatch<SetStateAction<boolean>>>;