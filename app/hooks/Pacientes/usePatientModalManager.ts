import { useState } from 'react';

interface ModalConfig {
    isOpen: boolean;
    target: 'obraSocial' | 'institucion' | 'practicas';
    label: string;
}

interface UsePatientModalManagerProps {
    saveNewOption: (target: 'obraSocial' | 'institucion' | 'practicas', newValue: string) => void;
}

export const usePatientModalManager = ({ saveNewOption }: UsePatientModalManagerProps) => {
    const [modalConfig, setModalConfig] = useState<ModalConfig>({
        isOpen: false,
        target: 'obraSocial',
        label: ''
    });

    const openAddModal = (target: 'obraSocial' | 'institucion' | 'practicas', label: string): void => {
        setModalConfig({ isOpen: true, target, label });
    };

    const closeAddModal = (): void => {
        setModalConfig((prev: ModalConfig) => ({ ...prev, isOpen: false }));
    };

    const handleConfirmSave = (newValue: string): void => {
        saveNewOption(modalConfig.target, newValue);
        closeAddModal();
    };

    return {
        modalConfig,
        openAddModal,
        closeAddModal,
        handleConfirmSave
    };
};