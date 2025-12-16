import { useState, useRef, useEffect } from "react";
import React from "react";

interface DropdownStates {
    patient: boolean
    practice: boolean
    obraSocial: boolean
    institucion: boolean
}

export type FilterFieldKey = keyof DropdownStates;

interface DropdownSetters {
    patient: React.Dispatch<React.SetStateAction<boolean>>
    practice: React.Dispatch<React.SetStateAction<boolean>>
    obraSocial: React.Dispatch<React.SetStateAction<boolean>>
    institucion: React.Dispatch<React.SetStateAction<boolean>>
}

interface UseFilterDropdownsResult {
    formRef: React.RefObject<HTMLDivElement>
    showStates: DropdownStates
    showSetters: DropdownSetters
    closeAllDropdowns: () => void
    handleOpen: (field: FilterFieldKey) => void
}

export const useFilterDropdowns = (): UseFilterDropdownsResult => {
    const formRef: React.RefObject<HTMLDivElement> = useRef<HTMLDivElement | null>(null);

    const [showPatient, setShowPatient] = useState<boolean>(false);
    const [showPractice, setShowPractice] = useState<boolean>(false);
    const [showObraSocial, setShowObraSocial] = useState<boolean>(false);
    const [showInstitucion, setShowInstitucion] = useState<boolean>(false);

    const showSetters: DropdownSetters = {
        patient: setShowPatient,
        practice: setShowPractice,
        obraSocial: setShowObraSocial,
        institucion: setShowInstitucion,
    };

    const showStates: DropdownStates = {
        patient: showPatient,
        practice: showPractice,
        obraSocial: showObraSocial,
        institucion: showInstitucion,
    };

    const closeAllDropdowns = (): void => {
        (Object.keys(showSetters) as (keyof DropdownSetters)[]).forEach((k: keyof DropdownSetters) => {
            if (showStates[k]) showSetters[k](false);
        });
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent): void => {
            if (formRef.current && !formRef.current.contains(e.target as Node)) {
                closeAllDropdowns();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleOpen = (field: FilterFieldKey): void => {
        (Object.keys(showSetters) as (keyof DropdownSetters)[]).forEach((k: keyof DropdownSetters) => {
            showSetters[k](k === field);
        });
    };

    return {
        formRef,
        showStates,
        showSetters,
        closeAllDropdowns,
        handleOpen,
    };
};