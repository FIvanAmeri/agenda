"use client";

import React, { useEffect } from "react";
import { useObrasSociales } from "../hooks/useObrasSociales";
import { PatientFormFields } from "../components/PatientFormFields";
import { FormActions } from "../components/FormActions";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { ModalBase } from "./Modals/ModalBase";
import { PropsEditPatientModal } from "../components/interfaz/tipos-paciente";
import { useFormularioPaciente } from "../hooks/Pacientes/useFormularioPaciente";
import { Patient } from "../components/interfaz/interfaz";

export const EditPatientModal: React.FC<PropsEditPatientModal> = ({
    selectedPatient,
    updatePatient,
    setShowEditModal,
}) => {
    const { obrasSociales } = useObrasSociales(); 

    const {
        formData,
        error,
        handleInputChange,
        handleCheckboxChange,
        handleSubmit,
        closeModal,
    } = useFormularioPaciente({ selectedPatient, updatePatient, setShowEditModal, obrasSociales });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [closeModal]);

    const handleSelectPatientStub = (p: Patient) => {
        return p;
    };

    return (
        <ModalBase title="Editar Paciente" onClose={closeModal}>
            <form onSubmit={handleSubmit}>
                <PatientFormFields
                    formData={formData}
                    obrasSociales={obrasSociales}
                    onInputChange={handleInputChange}
                    onCheckboxChange={handleCheckboxChange}
                    suggestions={[]}
                    showSuggestions={false}
                    onSelectPatient={handleSelectPatientStub}
                />
                
                <ErrorDisplay error={error} />
                <FormActions onCancel={closeModal} submitText="Guardar Cambios" />
            </form>
        </ModalBase>
    );
};

export default EditPatientModal;