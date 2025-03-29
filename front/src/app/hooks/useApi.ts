import { ApiResponse, PatientFormData } from "../components/interfaz/interfaz";

export const useApi = () => {
    const createPatient = async (patientData: PatientFormData) => {
      const dataToSend = {
        ...patientData,
        practicas: Array.isArray(patientData.practicas) ? 
                  patientData.practicas.join(', ') : 
                  patientData.practicas
      };
  
      const response = await fetch('http://localhost:3001/api/paciente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear el paciente');
      }
  
      return await response.json() as ApiResponse;
    };
  
    const updatePatient = async (id: string, patientData: PatientFormData) => {
      const dataToSend = {
        ...patientData,
        practicas: Array.isArray(patientData.practicas) ? 
                  patientData.practicas.join(', ') : 
                  patientData.practicas
      };
  
      const response = await fetch(`http://localhost:3001/api/paciente/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el paciente');
      }
  
      return await response.json() as ApiResponse;
    };
  
    return { createPatient, updatePatient };
  };