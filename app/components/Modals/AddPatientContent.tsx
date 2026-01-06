"use client";

import React, { RefObject } from 'react';
import { ModalBase } from "./ModalBase";
import { PatientFormContainer } from "./PatientFormContainer";
import { AddPatientOverlays } from "./AddPatientOverlays";
import { AddPatientEventListeners } from "./AddPatientEventListeners";
import { AddPatientViewProps } from "../interfaz/pacientes.types";

interface AddPatientContentProps extends AddPatientViewProps {
    modalRef: RefObject<HTMLDivElement>;
}

export const AddPatientContent: React.FC<AddPatientContentProps> = ({
    onClose,
    modalRef,
    form,
    manager,
    combinedObrasSociales
}) => {
    return (
        <>
            <AddPatientEventListeners 
                onClose={onClose}
                modalRef={modalRef}
                isExtraModalOpen={manager.modalConfig.isOpen}
                onCloseExtraModal={manager.closeAddModal}
                onCloseSuggestions={(): void => form.setShowSuggestions(false)}
            />

            <ModalBase title="Agregar Paciente" onClose={onClose}>
                <PatientFormContainer 
                    form={form}
                    manager={manager}
                    obrasSociales={combinedObrasSociales}
                    onClose={onClose}
                />
            </ModalBase>

            <AddPatientOverlays 
                showSuccessToast={form.showSuccessToast}
                isAddOptionOpen={manager.modalConfig.isOpen}
                optionLabel={manager.modalConfig.label}
                onCloseOption={manager.closeAddModal}
                onSaveOption={manager.handleConfirmSave}
            />
        </>
    );
};