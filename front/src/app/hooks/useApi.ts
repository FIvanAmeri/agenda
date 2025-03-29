export const useApi = () => {
    const createPatient = async (patientData: any) => {
      const response = await fetch('http://localhost:3001/api/paciente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
  
      if (!response.ok) {
        throw new Error('Error al crear el paciente');
      }
  
      return await response.json();
    };
  
    const updatePatient = async (id: string, patientData: any) => {
      const response = await fetch(`http://localhost:3001/api/paciente/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData),
      });
  
      if (!response.ok) {
        throw new Error('Error al actualizar el paciente');
      }
  
      return await response.json();
    };
  
    return { createPatient, updatePatient };
  };