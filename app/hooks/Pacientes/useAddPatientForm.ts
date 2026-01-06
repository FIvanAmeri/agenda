import { useState, useMemo } from 'react';
import { User, Patient, PatientFormData } from '../../components/interfaz/interfaz';
import api from '@/app/services/api';

interface UseAddPatientFormProps {
    user: User;
    onAdd: (newPatient: Patient) => void;
    onClose: () => void;
    existingPatients: Patient[];
}

export const useAddPatientForm = ({ user, onAdd, onClose, existingPatients }: UseAddPatientFormProps) => {
    const getCurrentLocalDate = (): string => {
        const now: Date = new Date();
        const year: number = now.getFullYear();
        const month: string = String(now.getMonth() + 1).padStart(2, '0');
        const day: string = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState<PatientFormData & { fechaNacimiento: string | null }>({
        dia: getCurrentLocalDate(),
        hora: '',
        paciente: '',
        fechaNacimiento: null,
        practicas: '',
        obraSocial: '',
        institucion: '',
        estudioUrgoginecologico: false
    });

    const [extraObrasSociales, setExtraObrasSociales] = useState<string[]>([]);
    const [extraInstituciones, setExtraInstituciones] = useState<string[]>([]);
    const [extraPracticas, setExtraPracticas] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const suggestions: Patient[] = useMemo((): Patient[] => {
        if (!existingPatients || existingPatients.length === 0 || !formData.paciente || formData.paciente.length < 2) {
            return [];
        }
        const term: string = formData.paciente.toLowerCase().trim();
        const filtered: Patient[] = existingPatients.filter((p: Patient): boolean => 
            p.paciente !== undefined && p.paciente.toLowerCase().includes(term)
        );
        const uniqueMap: Map<string, Patient> = new Map<string, Patient>();
        filtered.forEach((p: Patient): void => {
            const key: string = p.paciente.toLowerCase().trim();
            if (!uniqueMap.has(key)) uniqueMap.set(key, p);
        });
        return Array.from(uniqueMap.values()).slice(0, 5);
    }, [formData.paciente, existingPatients]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setFormData((prev: PatientFormData & { fechaNacimiento: string | null }) => ({ ...prev, [name]: value }));
        if (name === 'paciente') setShowSuggestions(true);
    };

    const handleSelectPatient = (p: Patient): void => {
        setFormData((prev: PatientFormData & { fechaNacimiento: string | null }) => ({
            ...prev,
            paciente: p.paciente,
            fechaNacimiento: p.fechaNacimiento,
            obraSocial: p.obraSocial
        }));
        setShowSuggestions(false);
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const isChecked: boolean = e.target.checked;
        setFormData((prev: PatientFormData & { fechaNacimiento: string | null }) => ({
            ...prev,
            estudioUrgoginecologico: isChecked,
            practicas: isChecked
                ? prev.practicas.includes("(U)") ? prev.practicas : `${prev.practicas} (U)`
                : prev.practicas.replace(" (U)", "")
        }));
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        const newPatientRequest = { 
            ...formData, 
            userId: Number(user.id), 
            estadoPago: 'no pagado', 
            montoPagado: 0, 
            montoTotal: 0, 
            fechaPagoParcial: null, 
            fechaPagoTotal: null 
        };

        try {
            const { data } = await api.post('/pacientes', newPatientRequest);
            
            setShowSuccessToast(true);
            setTimeout((): void => {
                onAdd(data.paciente);
                onClose();
            }, 500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Hubo un error');
        }
    };

    return {
        formData,
        setFormData,
        extraObrasSociales,
        setExtraObrasSociales,
        extraInstituciones,
        setExtraInstituciones,
        extraPracticas,
        setExtraPracticas,
        showSuggestions,
        setShowSuggestions,
        showSuccessToast,
        error,
        suggestions,
        handleInputChange,
        handleSelectPatient,
        handleCheckboxChange,
        handleSubmit
    };
};