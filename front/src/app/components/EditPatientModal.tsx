"use client";

import React, { useEffect } from "react";
import { useObrasSociales } from "../hooks/useObrasSociales";
import { PatientFormFields } from "../components/PatientFormFields";
import { FormActions } from "../components/FormActions";
import { ErrorDisplay } from "../components/ErrorDisplay";
import { ModalBase } from "./Modals/ModalBase";
import { PropsEditPatientModal } from "../components/interfaz/tipos-paciente";
import { useFormularioPaciente } from "../hooks/Pacientes/useFormularioPaciente";

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