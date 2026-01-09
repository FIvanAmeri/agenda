import { Patient, User } from "../../components/interfaz/interfaz";
import { useAddPatientForm } from "./useAddPatientForm";
import { usePatientOptions } from "./usePatientOptions";
import { usePatientModalManager } from "./usePatientModalManager";
import { useObrasSocialesCombinadas } from "./useObrasSocialesCombinadas";

interface UseAddPatientLogicProps {
    user: User;
    onAdd: (newPatient: Patient) => void;
    onClose: () => void;
    existingPatients: Patient[];
} 

export const useAddPatientLogic = ({
    user,
    onAdd,
    onClose,
    existingPatients
}: UseAddPatientLogicProps) => {
    const form = useAddPatientForm({ user, onAdd, onClose, existingPatients });
    const options = usePatientOptions({ setFormData: form.setFormData });
    const manager = usePatientModalManager({ saveNewOption: options.saveNewOption });
    const combinedObrasSociales = useObrasSocialesCombinadas({ 
        extraObrasSociales: options.extraObrasSociales 
    });

    return {
        form,
        manager,
        combinedObrasSociales
    };
};