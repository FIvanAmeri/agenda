"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { DropdownStates, FilterFieldKey, ShowSetters } from "./useFilterDropdowns.types";

export const useFilterDropdowns = () => {
    const [showStates, setShowStates] = useState<DropdownStates>({
        patient: false,
        practice: false,
        institucion: false,
        obraSocial: false,
    });

    const formRef = useRef<HTMLDivElement>(null);

    const closeAllDropdowns = useCallback(() => {
        setShowStates({
            patient: false,
            practice: false,
            institucion: false,
            obraSocial: false,
        });
    }, []);

    const handleOpen = useCallback((field: FilterFieldKey) => {
        setShowStates({
            patient: false,
            practice: false,
            institucion: false,
            obraSocial: false,
            [field]: true
        });
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                closeAllDropdowns();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [closeAllDropdowns]);

    const showSetters: ShowSetters = {
        patient: (val) => setShowStates(prev => ({ ...prev, patient: typeof val === 'function' ? val(prev.patient) : val })),
        practice: (val) => setShowStates(prev => ({ ...prev, practice: typeof val === 'function' ? val(prev.practice) : val })),
        institucion: (val) => setShowStates(prev => ({ ...prev, institucion: typeof val === 'function' ? val(prev.institucion) : val })),
        obraSocial: (val) => setShowStates(prev => ({ ...prev, obraSocial: typeof val === 'function' ? val(prev.obraSocial) : val })),
    };

    return {
        formRef,
        showStates,
        showSetters,
        closeAllDropdowns,
        handleOpen
    };
};