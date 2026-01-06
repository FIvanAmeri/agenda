"use client";

import React, { useEffect, useMemo } from "react";
import { useObrasSociales } from "../../hooks/useObrasSociales";
import { PatientFormFields } from "../PatientFormFields";
import { FormActions } from "../FormActions";
import { ErrorDisplay } from "../ErrorDisplay";
import { ModalBase } from "./ModalBase";
import { PropsEditPatientModal } from "../interfaz/tipos-paciente";
import { useFormularioPaciente } from "../../hooks/Pacientes/useFormularioPaciente";
import { Patient, User } from "../interfaz/interfaz";

interface ExtendedEditProps extends PropsEditPatientModal {
    user: User;
}

export const EditPatientModal: React.FC<ExtendedEditProps> = ({
    selectedPatient,
    updatePatient,
    setShowEditModal,
    user
}) => {
    const { obrasSociales } = useObrasSociales(); 

    const uniqueObrasSociales = useMemo(() => {
        return Array.from(new Set(obrasSociales));
    }, [obrasSociales]);

    const {
        formData,
        error,
        handleInputChange,
        handleCheckboxChange,
        handleSubmit,
        closeModal,
    } = useFormularioPaciente({ 
        selectedPatient, 
        updatePatient, 
        setShowEditModal, 
        obrasSociales: uniqueObrasSociales 
    });

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeModal]);

    const handleSelectPatientStub = (p: Patient): Patient => {
        return p;
    };

    return (
        <ModalBase title="Editar información del paciente" onClose={closeModal}>
            <form onSubmit={handleSubmit} className="flex flex-col w-full h-full">
                <div className="flex-1 pb-24 md:pb-4">
                    <div className="w-full">
                        <PatientFormFields
                            formData={formData}
                            obrasSociales={uniqueObrasSociales}
                            onInputChange={handleInputChange}
                            onCheckboxChange={handleCheckboxChange}
                            suggestions={[]}
                            showSuggestions={false}
                            onSelectPatient={handleSelectPatientStub}
                        />
                    </div>
                    <div className="mt-4">
                        <ErrorDisplay error={error} />
                    </div>
                </div>
                
                <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0F2A35] border-t border-[#004d40] md:static md:bg-transparent md:border-0 md:p-0 md:mt-8 shrink-0 z-50">
                    <div className="flex justify-center md:justify-end">
                        <FormActions onCancel={closeModal} submitText="Actualizar Registro" />
                    </div>
                </div>
            </form>
        </ModalBase>
    );
};

export default EditPatientModal;