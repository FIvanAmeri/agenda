"use client"

import React, { createContext, useState, useContext, ReactNode } from "react";


interface ObrasSocialesContextType {
  obrasSociales: string[];
  setObrasSociales: React.Dispatch<React.SetStateAction<string[]>>;
}


const ObrasSocialesContext = createContext<ObrasSocialesContextType | undefined>(undefined);


export const ObrasSocialesProvider = ({ children }: { children: ReactNode }) => {
  const [obrasSociales, setObrasSociales] = useState<string[]>([
    "Escoja una opción",
    "Particular",
    "Iosfa",
    "Ospac",
    "Avalian",
    "Iapos",
    "Bco Sta Fe",
    "Osam",
    "Galeno",
    "Medifé",
    "Osde",
    "Omint",
    "Esencial",
    "Swiss",
    "Caja Forense",
    "Jerárquicos",
    "Sancor",
    "Poder Judicial",
    "UNR",
    "Cs Económicas",
    "Pat Cabot",
    "Acindar",
    "Dasuten",
    "Sadaic",
    "Ospe",
    "Ospit",
    "Osam",
    "Federación Médica"
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
