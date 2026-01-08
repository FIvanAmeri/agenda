import { useState, FormEvent, ChangeEvent } from 'react';
import { formatDate } from '../utilidades/dateTimeHelpers';
import { Patient, PatientFormData } from '../components/interfaz/interfaz';

export const usePatientForm = (
    onAdd: (newPatient: Patient) => void,
    initialPatient?: Partial<Patient>
) => {
    const getCurrentDate = (): string => formatDate(new Date().toISOString());

    const initialFormData: PatientFormData = {
        dia: initialPatient?.dia || getCurrentDate(),
        hora: initialPatient?.hora || '',
        paciente: initialPatient?.paciente || '',
        practicas: initialPatient?.practicas || '', 
        obraSocial: initialPatient?.obraSocial || '',
        institucion: initialPatient?.institucion || '',
        estudioUrgoginecologico: initialPatient?.practicas?.includes("(U)") || false
    };

    const [formData, setFormData] = useState<PatientFormData>(initialFormData);
    const [error, setError] = useState<string | null>(null);
    const [showSuccessToast, setShowSuccessToast] = useState<boolean>(false);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const saveNewOption = (target: 'obraSocial' | 'institucion' | 'practicas', newValue: string): void => {
        setFormData(prev => ({
            ...prev,
            [target]: newValue
        }));
    };

    const handleCheckboxChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const isChecked = e.target.checked;
        setFormData(prev => {
            const currentPracticas = prev.practicas || '';
            let updatedArray = currentPracticas.split(',').map(p => p.trim()).filter(p => p);
            if (isChecked) {
                if (!updatedArray.some(p => p.includes("(U)"))) updatedArray.push("(U)");
            } else {
                updatedArray = updatedArray.filter(p => !p.includes("(U)"));
            }
            return {
                ...prev,
                estudioUrgoginecologico: isChecked,
                practicas: updatedArray.join(', ')
            };
        });
    };

    const triggerSuccessToast = (): void => {
        setShowSuccessToast(true);
        setTimeout(() => setShowSuccessToast(false), 3000);
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        try {
            const response = await fetch('/api/pacientes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                const data: Patient = await response.json();
                triggerSuccessToast();
                onAdd(data);
            } else {
                setError("Error al guardar");
            }
        } catch (err: unknown) {
            setError("Error de red");
        }
    };

    return {
        formData,
        setFormData,
        error,
        setError,
        handleInputChange,
        handleCheckboxChange,
        showSuccessToast,
        handleSubmit,
        showSuggestions,
        setShowSuggestions,
        triggerSuccessToast,
        saveNewOption
    };
};