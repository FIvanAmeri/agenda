import { useState, useRef, useEffect } from "react";

export const useFilterDropdowns = () => {
  const formRef = useRef<HTMLDivElement | null>(null);

  const [showPatient, setShowPatient] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [showObraSocial, setShowObraSocial] = useState(false);
  const [showInstitucion, setShowInstitucion] = useState(false);

  const showSetters = {
    patient: setShowPatient,
    practice: setShowPractice,
    obraSocial: setShowObraSocial,
    institucion: setShowInstitucion,
  } as const;

  const showStates = {
    patient: showPatient,
    practice: showPractice,
    obraSocial: showObraSocial,
    institucion: showInstitucion,
  } as const;

  const closeAllDropdowns = () => {
    (Object.keys(showSetters) as (keyof typeof showSetters)[]).forEach((k) => {
      if (showStates[k]) showSetters[k](false);
    });
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (formRef.current && !formRef.current.contains(e.target as Node)) {
        closeAllDropdowns();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = (field: keyof typeof showSetters) => {
    (Object.keys(showSetters) as (keyof typeof showSetters)[]).forEach((k) => {
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
