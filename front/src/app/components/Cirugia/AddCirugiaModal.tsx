"use client";

import React, { useCallback, useEffect } from "react";
import ModalBase from "./ModalBase"; 
import CirugiaFormFields from "./CirugiaFormFields";
import { User } from "../interfaz/interfaz";

interface AddCirugiaModalProps {
    user: User;
    onClose: () => void;
    onAdded: () => void;
}

const AddCirugiaModal: React.FC<AddCirugiaModalProps> = ({ user, onClose, onAdded }) => {

    const closeModal = useCallback(() => { onClose(); }, [onClose]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [closeModal]);

    return (
        <ModalBase 
            title="Agregar Cirugía" 
            onClose={closeModal}
            contentClassName="bg-gradient-to-br from-blue-700 to-green-600 text-white" 
        > 
            <CirugiaFormFields 
                user={user} 
                onAdded={onAdded} 
                onClose={closeModal} 
            /> 
        </ModalBase>
    );
};

export default AddCirugiaModal;