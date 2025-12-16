"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { useObrasSociales } from '../../hooks/useObrasSociales';
import { Patient, User } from "../interfaz/interfaz";
import { DatosFormularioPaciente } from "../interfaz/tipos-paciente";
import { ModalBase } from "./ModalBase"; 
import { PatientFormFields } from "../PatientFormFields";
import { FormActions } from "../FormActions";
import { ErrorDisplay } from "../ErrorDisplay";
import { formatDate } from "../../utilidades/dateTimeHelpers";

interface EditPatientModalProps {
    user: User;
    selectedPatient: Patient;
    updatePatient: (updatedPatient: Patient) => void;
    setShowEditModal: (show: boolean) => void;
}

const parsePracticas = (practicas: string) => {
    const isUroginecologico = practicas.includes(" (U)");
    const basePractica = practicas.replace(" (U)", "");
    return { basePractica, isUroginecologico };
};

const EditPatientModal: React.FC<EditPatientModalProps> = ({ 
    user, 
    selectedPatient, 
    updatePatient, 
    setShowEditModal 
}) => {
    const { obrasSociales } = useObrasSociales();
    const [error, setError] = useState<string | null>(null);


    const [formData, setFormData] = useState<DatosFormularioPaciente>({
        dia: formatDate(selectedPatient.dia),
        hora: selectedPatient.hora,
        paciente: selectedPatient.paciente,
        fechaNacimiento: selectedPatient.fechaNacimiento,
        practicas: selectedPatient.practicas, 
        obraSocial: selectedPatient.obraSocial,
        institucion: selectedPatient.institucion,
        estudioUrgoginecologico: parsePracticas(selectedPatient.practicas).isUroginecologico
    });


    useEffect(() => {
        setFormData({
            dia: formatDate(selectedPatient.dia),
            hora: selectedPatient.hora,
            paciente: selectedPatient.paciente,
            fechaNacimiento: selectedPatient.fechaNacimiento,
            practicas: selectedPatient.practicas,
            obraSocial: selectedPatient.obraSocial,
            institucion: selectedPatient.institucion,
            estudioUrgoginecologico: parsePracticas(selectedPatient.practicas).isUroginecologico
        });
    }, [selectedPatient]);


    const closeModal = useCallback(() => { setShowEditModal(false); }, [setShowEditModal]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeModal]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === 'practicas' && formData.estudioUrgoginecologico) {
            setFormData(prev => ({ 
                ...prev, 
                practicas: `${value} (U)`
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        
        setFormData(prev => {
            const basePractica = prev.practicas.replace(" (U)", "");

            if (isChecked) {
                if (basePractica) {
                    return { ...prev, estudioUrgoginecologico: isChecked, practicas: `${basePractica} (U)` };
                }
                return { ...prev, estudioUrgoginecologico: isChecked };

            } else {
                return { 
                    ...prev, 
                    estudioUrgoginecologico: isChecked, 
                    practicas: basePractica 
                };
            }
        });
    };
    
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();


        if (!formData.practicas.replace(" (U)", "") || !formData.institucion) {
            setError("Por favor, selecciona una Práctica y una Institución.");
            return;
        }

        const updatedPatient: Patient = {
            ...selectedPatient, 
            ...formData,
            dia: formData.dia, 
            hora: formData.hora, 
            userId: Number(user.id)
        };

        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`http://localhost:3001/api/paciente/${selectedPatient.id}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(updatedPatient),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Error al editar paciente:", text);
                throw new Error('Error al actualizar el paciente');
            }

            const result = await response.json(); 
            updatePatient(result.paciente);
            closeModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Hubo un error al actualizar');
        }
    };

    if (!selectedPatient) return null;

    return (
        <ModalBase title="Editar Paciente" onClose={closeModal}>
            <form onSubmit={handleSubmit}>
                <PatientFormFields
                    formData={formData}
                    obrasSociales={obrasSociales}
                    onInputChange={handleInputChange}
                    onCheckboxChange={handleCheckboxChange}
                />
                <ErrorDisplay error={error} />
                <FormActions onCancel={closeModal} submitText="Guardar Cambios" />
            </form>
        </ModalBase>
    );
};

export default EditPatientModal;