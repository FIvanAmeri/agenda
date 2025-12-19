"use client";

import React from 'react';
import { SuccessToast } from "./SuccessToast";
import { ModalAgregarOpcion } from "../Cirugia/ModalAgregarOpcion";

interface AddPatientOverlaysProps {
    showSuccessToast: boolean;
    isAddOptionOpen: boolean;
    optionLabel: string;
    onCloseOption: () => void;
    onSaveOption: (newValue: string) => void;
}

export const AddPatientOverlays: React.FC<AddPatientOverlaysProps> = ({
    showSuccessToast,
    isAddOptionOpen,
    optionLabel,
    onCloseOption,
    onSaveOption
}) => {
    return (
        <>
            {showSuccessToast && (
                <SuccessToast 
                    message="Paciente Agregado" 
                    description="La información se guardó correctamente" 
                />
            )}

            {isAddOptionOpen && (
                <ModalAgregarOpcion 
                    etiqueta={optionLabel} 
                    onClose={onCloseOption} 
                    onSave={onSaveOption} 
                />
            )}
        </>
    );
};