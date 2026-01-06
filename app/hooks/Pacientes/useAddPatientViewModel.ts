import { Patient, User } from "../../components/interfaz/interfaz";
import { AddPatientViewProps } from "../../components/interfaz/pacientes.types";
import { useAddPatientLogic } from "./useAddPatientLogic";

interface UseAddPatientViewModelProps {
    user: User;
    onAdd: (newPatient: Patient) => void;
    onClose: () => void;
    existingPatients: Patient[];
}

export const useAddPatientViewModel = ({
    user,
    onAdd,
    onClose,
    existingPatients
}: UseAddPatientViewModelProps) => {
    const { form, manager, combinedObrasSociales } = useAddPatientLogic({
        user,
        onAdd,
        onClose,
        existingPatients
    });

    const contentProps: AddPatientViewProps = {
        onClose,
        form: {
            handleSubmit: form.handleSubmit,
            formData: form.formData,
            handleInputChange: form.handleInputChange,
            handleCheckboxChange: form.handleCheckboxChange,
            suggestions: form.suggestions,
            showSuggestions: form.showSuggestions,
            handleSelectPatient: form.handleSelectPatient,
            setShowSuggestions: form.setShowSuggestions,
            showSuccessToast: form.showSuccessToast,
            error: form.error
        },
        manager: {
            modalConfig: manager.modalConfig,
            openAddModal: manager.openAddModal,
            closeAddModal: manager.closeAddModal,
            handleConfirmSave: manager.handleConfirmSave
        },
        combinedObrasSociales
    };

    return {
        contentProps
    };
};