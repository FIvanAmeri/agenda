import { useState } from 'react';
import { formatDate } from '../utils/dateTimeHelpers';
import Patient from '../components/interfaz/interfaz';
import { PatientFormData } from '../components/interfaz/interfaz';

export const usePatientForm = (initialPatient?: Partial<Patient>) => {
  const getCurrentDate = (): string => {
    return formatDate(new Date().toISOString());
  };


  const parsePracticas = (practicasString?: string): string[] => {
    if (!practicasString) return [];
    return practicasString.split(',').map(p => p.trim()).filter(p => p);
  };

  const hasEstudioUrgoginecologico = (practicasString?: string): boolean => {
    return practicasString?.includes("(U)") || false;
  };

  const initialFormData: PatientFormData = {
    dia: initialPatient?.dia || getCurrentDate(),
    hora: initialPatient?.hora || '',
    paciente: initialPatient?.paciente || '',
    practicas: parsePracticas(initialPatient?.practicas),
    obraSocial: initialPatient?.obraSocial || '',
    institucion: initialPatient?.institucion || '',
    estudioUrgoginecologico: hasEstudioUrgoginecologico(initialPatient?.practicas)
  };

  const [formData, setFormData] = useState<PatientFormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setFormData(prev => {
      let updatedPracticas = [...prev.practicas];
      
      if (isChecked && !updatedPracticas.includes("(U)")) {
        updatedPracticas.push("(U)");
      } else if (!isChecked) {
        updatedPracticas = updatedPracticas.filter(p => p !== "(U)");
      }

      return {
        ...prev,
        estudioUrgoginecologico: isChecked,
        practicas: updatedPracticas
      };
    });
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