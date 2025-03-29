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

interface AddPatientModalProps {
  onClose: () => void;
  onAdd: (newPatient: Patient) => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ onClose, onAdd }) => {
  const { obrasSociales } = useObrasSociales();
  const { closeModal } = useModal(onClose);
  const { formData, error, setError, handleInputChange, handleCheckboxChange } = usePatientForm();
  const { createPatient } = useApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await createPatient({
        hora: formData.hora,
        dia: formData.dia,
        paciente: formData.paciente,
        practicas: formData.practicas,
        obraSocial: formData.obraSocial,
        institucion: formData.institucion,
      });

      onAdd(result.paciente);
      closeModal();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Hubo un error');
    }
  };

  return (
    <ModalBase title="Agregar Paciente" onClose={closeModal}>
      <form onSubmit={handleSubmit}>
        <PatientFormFields
          formData={formData}
          obrasSociales={obrasSociales}
          onInputChange={handleInputChange}
          onCheckboxChange={handleCheckboxChange}
        />
        
        <ErrorDisplay error={error} />
        <FormActions onCancel={closeModal} submitText="Agregar" />
      </form>
    </ModalBase>
  );
};

export default AddPatientModal;