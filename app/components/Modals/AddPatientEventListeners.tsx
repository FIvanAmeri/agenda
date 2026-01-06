"use client";

import React, { RefObject } from 'react';
import { useModalEvents } from "../../hooks/Pacientes/useModalEvents";

interface AddPatientEventListenersProps {
    onClose: () => void;
    modalRef: RefObject<HTMLDivElement>;
    isExtraModalOpen: boolean;
    onCloseExtraModal: () => void;
    onCloseSuggestions: () => void;
}

export const AddPatientEventListeners: React.FC<AddPatientEventListenersProps> = ({
    onClose,
    modalRef,
    isExtraModalOpen,
    onCloseExtraModal,
    onCloseSuggestions
}) => {
    useModalEvents({
        onClose,
        modalRef,
        isOpenExtraModal: isExtraModalOpen,
        setOpenExtraModal: (value: boolean): void => {
            if (!value) onCloseExtraModal();
        },
        onOutsideClick: onCloseSuggestions
    });

    return null;
};