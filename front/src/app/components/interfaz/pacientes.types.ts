import { Patient, PatientFormData, User } from "./interfaz";

export interface PatientFormLogic {
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    formData: PatientFormData & { fechaNacimiento: string | null };
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    suggestions: Patient[];
    showSuggestions: boolean;
    handleSelectPatient: (p: Patient) => void;
    setShowSuggestions: (v: boolean) => void;
    showSuccessToast: boolean;
    error: string | null;
}

export interface PatientModalManager {
    modalConfig: { 
        isOpen: boolean; 
        target: 'obraSocial' | 'institucion' | 'practicas';
        label: string; 
    };
    openAddModal: (target: 'obraSocial' | 'institucion' | 'practicas', label: string) => void;
    closeAddModal: () => void;
    handleConfirmSave: (v: string) => void;
}

export interface AddPatientViewProps {
    onClose: () => void;
    form: PatientFormLogic;
    manager: PatientModalManager;
    combinedObrasSociales: string[];
}

export interface AddPatientModalProps {
    user: User;
    onClose: () => void;
    onAdd: (newPatient: Patient) => void;
    existingPatients?: Patient[];
}