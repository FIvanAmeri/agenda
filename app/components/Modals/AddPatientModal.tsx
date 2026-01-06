"use client";

import React, { useRef } from 'react';
import { ModalPortalLayout } from "./ModalPortalLayout";
import { AddPatientProvider } from "./AddPatientProvider";
import { AddPatientModalProps } from "../interfaz/pacientes.types";

const AddPatientModal: React.FC<AddPatientModalProps> = (props) => {
    const modalRef = useRef<HTMLDivElement>(null);

    return (
        <ModalPortalLayout modalRef={modalRef}>
            <AddPatientProvider 
                {...props} 
                modalRef={modalRef} 
            />
        </ModalPortalLayout>
    );
};

export default AddPatientModal;