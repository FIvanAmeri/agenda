import { Patient } from "../interfaz/interfaz"; 
import React from "react";

export interface DatosFormularioPaciente {
    dia: string;
    hora: string;
    paciente: string;
    fechaNacimiento: string | null;
    practicas: string;
    obraSocial: string;
    institucion: string;
    estudioUrgoginecologico: boolean;
}

export interface PropsEditPatientModal {
    selectedPatient: Patient;
    updatePatient: (updatedPatient: Patient) => void;
    setShowEditModal: (value: boolean) => void;
}

export interface PropsUseFormularioPaciente extends PropsEditPatientModal {
    obrasSociales: string[];
}

export interface ResultadoUseFormularioPaciente {
    formData: DatosFormularioPaciente;
    error: string | null;
    obrasSociales: string[];
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    closeModal: () => void;
}