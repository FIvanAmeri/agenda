
import React, { useState, useEffect, useCallback } from 'react';
import { useObrasSociales } from '../../hooks/useObrasSociales';
import Patient from "../interfaz/interfaz";
import { ModalBase } from "./ModalBase";
import { PatientFormFields } from "../PatientFormFields";
import { FormActions } from "../FormActions";
import { ErrorDisplay } from "../ErrorDisplay";
import {  formatDate } from "../../utils/dateTimeHelpers";

interface AddPatientModalProps {
  onClose: () => void;
  onAdd: (newPatient: Patient) => void;
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ onClose, onAdd }) => {
  const { obrasSociales } = useObrasSociales();


  const getCurrentDate = (): string => {
    return formatDate(new Date().toISOString());
  };


  const [formData, setFormData] = useState({
    dia: getCurrentDate(),
    hora: '',
    paciente: '',
    practicas: '',
    obraSocial: '',
    institucion: '',
    estudioUrgoginecologico: false
  });

  const [error, setError] = useState<string | null>(null);

  const closeModal = useCallback(() => {
    onClose();
  }, [onClose]);


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

    const newPatient = {
      hora: formData.hora,
      dia: formData.dia,
      paciente: formData.paciente,
      practicas: formData.practicas,
      obraSocial: formData.obraSocial,
      institucion: formData.institucion,
    };

    try {
      const response = await fetch('http://localhost:3001/api/paciente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPatient),
      });

      if (!response.ok) {
        throw new Error('Error al crear el paciente');
      }

      const result = await response.json();
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