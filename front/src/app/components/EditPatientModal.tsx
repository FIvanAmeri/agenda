import React, { useState, useEffect, useCallback } from "react";
import { useObrasSociales } from "../hooks/useObrasSociales";
import {Patient} from "./interfaz/interfaz";
import { ModalBase } from "../components/Modals/ModalBase";
import { PatientFormFields } from "./PatientFormFields";
import { FormActions } from "./FormActions";
import { ErrorDisplay } from "./ErrorDisplay";
import { extractTime, formatDate } from "../utils/dateTimeHelpers";

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

  const [formData, setFormData] = useState({
    dia: formatDate(selectedPatient.dia),
    hora: extractTime(selectedPatient.hora),
    paciente: selectedPatient.paciente,
    practicas: selectedPatient.practicas,
    obraSocial: selectedPatient.obraSocial,
    institucion: selectedPatient.institucion,
    estudioUrgoginecologico: selectedPatient.practicas.includes("(U)")
  });

  const [error, setError] = useState<string | null>(null);

  const closeModal = useCallback(() => {
    setShowEditModal(false);
  }, [setShowEditModal]);


  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [closeModal]);


  useEffect(() => {
    setFormData({
      dia: formatDate(selectedPatient.dia),
      hora: extractTime(selectedPatient.hora),
      paciente: selectedPatient.paciente,
      practicas: selectedPatient.practicas,
      obraSocial: selectedPatient.obraSocial,
      institucion: selectedPatient.institucion,
      estudioUrgoginecologico: selectedPatient.practicas.includes("(U)")
    });
  }, [selectedPatient]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setFormData(prev => ({
      ...prev,
      estudioUrgoginecologico: isChecked,
      practicas: isChecked 
        ? prev.practicas.includes("(U)") ? prev.practicas : `${prev.practicas} (U)`
        : prev.practicas.replace(" (U)", "")
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedPatient = {
      id: selectedPatient.id,
      hora: `${formData.dia}T${formData.hora}:00`,
      dia: formData.dia,
      paciente: formData.paciente,
      practicas: formData.practicas,
      obraSocial: formData.obraSocial,
      institucion: formData.institucion,
    };

    try {
      const response = await fetch(`http://localhost:3001/api/paciente/${selectedPatient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPatient),
      });

      if (!response.ok) {
        throw new Error("Error al actualizar el paciente");
      }

      const result = await response.json();
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