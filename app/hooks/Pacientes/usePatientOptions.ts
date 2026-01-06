import { useState } from 'react';
import { PatientFormData } from '../../components/interfaz/interfaz';

interface UsePatientOptionsProps {
    setFormData: React.Dispatch<React.SetStateAction<PatientFormData & { fechaNacimiento: string | null }>>;
}

export const usePatientOptions = ({ setFormData }: UsePatientOptionsProps) => {
    const [extraObrasSociales, setExtraObrasSociales] = useState<string[]>([]);
    const [extraInstituciones, setExtraInstituciones] = useState<string[]>([]);
    const [extraPracticas, setExtraPracticas] = useState<string[]>([]);

    const saveNewOption = (target: 'obraSocial' | 'institucion' | 'practicas', newValue: string): void => {
        if (target === 'obraSocial') {
            setExtraObrasSociales((prev: string[]) => [...prev, newValue]);
            setFormData((prev: PatientFormData & { fechaNacimiento: string | null }) => ({ ...prev, obraSocial: newValue }));
        } else if (target === 'institucion') {
            setExtraInstituciones((prev: string[]) => [...prev, newValue]);
            setFormData((prev: PatientFormData & { fechaNacimiento: string | null }) => ({ ...prev, institucion: newValue }));
        } else if (target === 'practicas') {
            setExtraPracticas((prev: string[]) => [...prev, newValue]);
            setFormData((prev: PatientFormData & { fechaNacimiento: string | null }) => ({ ...prev, practicas: newValue }));
        }
    };

    return {
        extraObrasSociales,
        extraInstituciones,
        extraPracticas,
        saveNewOption
    };
};