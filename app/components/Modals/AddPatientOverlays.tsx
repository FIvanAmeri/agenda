"use client";

import React from 'react';
import { SuccessToast } from "./SuccessToast";
// REVISÁ ESTA RUTA, si el archivo está en la misma carpeta que el Overlay, quitá el "../Cirugia/"
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
    // Agregá este log para ver en la consola si el estado cambia a true cuando apretás el botón +
    console.log("¿Modal de opción abierto?:", isAddOptionOpen);

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