import { Cirugia } from "../../components/interfaz/interfaz";
import { useMemo } from "react";

interface CirugiaLists {
    patientNames: string[]
    tiposCirugia: string[]
    medicos: string[]
}

export const useCirugiaLists = (cirugias: Cirugia[]): CirugiaLists => {
    const { patientNames, tiposCirugia, medicos } = useMemo<CirugiaLists>(() => {
        const uniquePatientNames: Set<string> = new Set<string>();
        const uniqueTiposCirugia: Set<string> = new Set<string>();
        const uniqueMedicos: Set<string> = new Set<string>();

        cirugias.forEach((c: Cirugia) => {
            if (c.paciente) uniquePatientNames.add(c.paciente);
            if (c.tipoCirugia) uniqueTiposCirugia.add(c.tipoCirugia);
            if (c.medicoOpero) uniqueMedicos.add(c.medicoOpero);
            if (c.medicoAyudo1) uniqueMedicos.add(c.medicoAyudo1 as string);
            if (c.medicoAyudo2) uniqueMedicos.add(c.medicoAyudo2 as string);
        });

        return {
            patientNames: Array.from(uniquePatientNames).sort(),
            tiposCirugia: Array.from(uniqueTiposCirugia).sort(),
            medicos: Array.from(uniqueMedicos).sort(),
        };
    }, [cirugias]);

    return { patientNames, tiposCirugia, medicos };
};