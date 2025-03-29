import React from 'react';
import { useObrasSociales } from '../../hooks/useObrasSociales';
import Patient from "../interfaz/interfaz";
import { ModalBase } from "./ModalBase";
import { PatientFormFields } from "../PatientFormFields";
import { FormActions } from "../FormActions";
import { ErrorDisplay } from "../ErrorDisplay";
import { useModal } from '../../hooks/useModal';
import { usePatientForm } from '../../hooks/usePatientForm';
import { useApi } from '../../hooks/useApi';

interface EditPatientModalProps {
  selectedPatient: Patient;
  updatePatient: (updatedPatient: Patient) => void;
  setShowEditModal: (value: boolean) => void;
}

const EditPatientModal: React.FC<EditPatientModalProps> = ({
  selectedPatient,
  updatePatient,
  setShowEditModal,
}) => {
  const { obrasSociales } = useObrasSociales();
  const { closeModal } = useModal(() => setShowEditModal(false));
  const { formData, error, setError, handleInputChange, handleCheckboxChange } = usePatientForm(selectedPatient);
  const { updatePatient: apiUpdatePatient } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await apiUpdatePatient(selectedPatient.id.toString(), {
        hora: `${formData.dia}T${formData.hora}:00`,
        dia: formData.dia,
        paciente: formData.paciente,
        practicas: formData.practicas,
        obraSocial: formData.obraSocial,
        institucion: formData.institucion,
      });

      updatePatient(result.paciente);
      closeModal();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Hubo un error al actualizar");
    }
  };

  return (
    <ModalBase title="Editar Paciente" onClose={closeModal}>
      <form onSubmit={handleSubmit}>
        <PatientFormFields
          formData={formData}
          obrasSociales={obrasSociales}
          onInputChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
        />
        
        <ErrorDisplay error={error} />
        <FormActions onCancel={closeModal} submitText="Guardar Cambios" />
      </form>
    </ModalBase>
  );
};

export default EditPatientModal;