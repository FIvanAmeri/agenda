"use client"

import React, { createContext, useState, useContext, ReactNode } from "react";


interface ObrasSocialesContextType {
  obrasSociales: string[];
  setObrasSociales: React.Dispatch<React.SetStateAction<string[]>>;
}


export const ObrasSocialesContext = createContext<ObrasSocialesContextType | undefined>(undefined);


export const ObrasSocialesProvider = ({ children }: { children: ReactNode }) => {
  const [obrasSociales, setObrasSociales] = useState<string[]>([
    "Escoja una opción",
    "PARTICULAR",
    "IOSFA",
    "OSPAC",
    "AVALIAN",
    "IAPOS",
    "BCO STA FE",
    "OSAM",
    "GALENO",
    "MEDIFE",
    "OSDE",
    "OMINT",
    "ESENCIAL",
    "SWISS",
    "CAJA FORENSE",
    "JERARQUICOS",
    "SANCOR",
    "PODER JUDICIAL",
    "UNR",
    "CS ECONOMICAS",
    "PAT CABOT",
    "ACINDAR",
    "DASUTEN",
    "SADAIC",
    "OSPE",
    "OSPIT",
    "OSAM",
    "FEDERACION MEDICA",
    "CONSOLIDAR",
    "GRUPO SAN NICOLAS",
    "FEDERADA",
    "MUTUALYF"
  ]);

  return (
    <ObrasSocialesContext.Provider value={{ obrasSociales, setObrasSociales }}>
      {children}
    </ObrasSocialesContext.Provider>
  );
};


export const useObrasSociales = (): ObrasSocialesContextType => {
  const context = useContext(ObrasSocialesContext);
  if (!context) {
    throw new Error("useObrasSociales must be used within an ObrasSocialesProvider");
  }
  return context;
};
