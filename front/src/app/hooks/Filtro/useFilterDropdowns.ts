import { useState, useRef, useEffect, useMemo, useCallback } from "react";
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
    const formRef = useRef<HTMLDivElement>(null);

    const [showPatient, setShowPatient] = useState<boolean>(false);
    const [showPractice, setShowPractice] = useState<boolean>(false);
    const [showObraSocial, setShowObraSocial] = useState<boolean>(false);
    const [showInstitucion, setShowInstitucion] = useState<boolean>(false);

    const showSetters: DropdownSetters = useMemo(() => ({
        patient: setShowPatient,
        practice: setShowPractice,
        obraSocial: setShowObraSocial,
        institucion: setShowInstitucion,
    }), []);

    const showStates: DropdownStates = useMemo(() => ({
        patient: showPatient,
        practice: showPractice,
        obraSocial: showObraSocial,
        institucion: showInstitucion,
    }), [showPatient, showPractice, showObraSocial, showInstitucion]);

    const closeAllDropdowns = useCallback((): void => {
        setShowPatient(false);
        setShowPractice(false);
        setShowObraSocial(false);
        setShowInstitucion(false);
    }, []);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent): void => {
            const target = e.target as HTMLElement;

            const isInput = target.tagName === "INPUT";
            const isMenu = target.closest(".autocomplete-menu");

            if (!isInput && !isMenu) {
                closeAllDropdowns();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [closeAllDropdowns]);

    const handleOpen = useCallback((field: FilterFieldKey): void => {
        setShowPatient(field === "patient");
        setShowPractice(field === "practice");
        setShowObraSocial(field === "obraSocial");
        setShowInstitucion(field === "institucion");
    }, []);

    return {
        formRef: formRef as React.RefObject<HTMLDivElement>,
        showStates,
        showSetters,
        closeAllDropdowns,
        handleOpen,
    };
};