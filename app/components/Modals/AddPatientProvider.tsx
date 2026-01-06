"use client";

import React, { RefObject } from 'react';
import { useAddPatientViewModel } from "../../hooks/Pacientes/useAddPatientViewModel";
import { AddPatientContent } from "./AddPatientContent";
import { AddPatientModalProps } from "../interfaz/pacientes.types";

interface AddPatientProviderProps extends AddPatientModalProps {
    modalRef: RefObject<HTMLDivElement>;
}

export const AddPatientProvider: React.FC<AddPatientProviderProps> = ({ 
    user, 
    onClose, 
    onAdd, 
    existingPatients = [],
    modalRef
}) => {
    const { contentProps } = useAddPatientViewModel({ 
        user, 
        onAdd, 
        onClose, 
        existingPatients 
    });

    return (
        <AddPatientContent 
            {...contentProps}
            modalRef={modalRef}
        />
    );
};