import { Patient } from "../../components/interfaz/interfaz";
import { useMemo } from "react";

export const usePatientLists = (patients: Patient[]) => {
  const data = useMemo(() => (Array.isArray(patients) ? patients : []), [patients]);

  return useMemo(() => {
    const getUnique = (key: keyof Patient, clean: boolean = false): string[] => {
      const values = new Set<string>();
      
      data.forEach((p) => {
        const raw = p[key];
        if (typeof raw === "string" && raw.trim() !== "") {
          const val = clean ? raw.replace(" (U)", "") : raw;
          if (val) values.add(val.trim());
        }
      });

      return Array.from(values).sort((a, b) => a.localeCompare(b));
    };

    return {
      patientNames: getUnique("paciente"),
      practices: getUnique("practicas", true),
      obrasSociales: getUnique("obraSocial"),
      instituciones: getUnique("institucion"),
    };
  }, [data]);
};