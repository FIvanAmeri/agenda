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

    const handleConfirmSave = async (newValue: string): Promise<void> => {
        try {
            const token = localStorage.getItem("token");
            const response = await fetch('/api/opciones', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ 
                    tipo: modalConfig.target, 
                    nombre: newValue 
                }),
            });

            if (!response.ok) {
                const errorData: { message: string } = await response.json();
                throw new Error(errorData.message || 'Error al guardar');
            }

            saveNewOption(modalConfig.target, newValue);
            closeAddModal();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
            console.error('Error al guardar opción:', errorMessage);
        }
    };

    return {
        modalConfig,
        openAddModal,
        closeAddModal,
        handleConfirmSave
    };
};