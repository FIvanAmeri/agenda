import { useState } from 'react';
import { formatDate } from '../utils/dateTimeHelpers';

export const usePatientForm = (initialPatient?: any) => {
  const getCurrentDate = (): string => {
    return formatDate(new Date().toISOString());
  };

  const initialFormData = {
    dia: initialPatient?.dia || getCurrentDate(),
    hora: initialPatient?.hora || '',
    paciente: initialPatient?.paciente || '',
    practicas: initialPatient?.practicas || '',
    obraSocial: initialPatient?.obraSocial || '',
    institucion: initialPatient?.institucion || '',
    estudioUrgoginecologico: initialPatient?.practicas?.includes("(U)") || false
  };

  const [formData, setFormData] = useState(initialFormData);
  const [error, setError] = useState<string | null>(null);

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

  return {
    formData,
    setFormData,
    error,
    setError,
    handleInputChange,
    handleCheckboxChange
  };
};