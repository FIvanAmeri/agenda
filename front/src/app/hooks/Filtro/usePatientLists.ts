import { Patient } from "../../components/interfaz/interfaz";
import { useMemo } from "react";

export const usePatientLists = (patients: Patient[]) => {
  const dataToProcess = Array.isArray(patients) ? patients : [];

  const getUniqueAndSorted = (key: keyof Patient, clean: boolean = false) => {
    const values = new Set<string>();
    dataToProcess.forEach((p) => {
      const raw = p[key] as string;
      const val = clean ? raw.replace(" (U)", "") : raw;
      if (val) values.add(val);
    });
    return Array.from(values).filter(Boolean).sort();
  };

  const patientNames = useMemo(() => getUniqueAndSorted("paciente"), [dataToProcess]);
  const practices = useMemo(() => getUniqueAndSorted("practicas", true), [dataToProcess]);
  const obrasSociales = useMemo(() => getUniqueAndSorted("obraSocial"), [dataToProcess]);
  const instituciones = useMemo(() => getUniqueAndSorted("institucion"), [dataToProcess]);

  return { patientNames, practices, obrasSociales, instituciones };
};
