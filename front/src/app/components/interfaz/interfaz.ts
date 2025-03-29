// interfaces/Patient.ts
export default interface Patient {
  id: number;
  hora: string;
  paciente: string;
  practicas: string; // En la base de datos y API es string
  obraSocial: string;
  dia: string;
  institucion: string;
}

export interface PatientFormData {
  hora: string;
  paciente: string;
  practicas: string[]; // En el formulario es array
  obraSocial: string;
  dia: string;
  institucion: string;
  estudioUrgoginecologico?: boolean; // Opcional para el checkbox
}

export interface ApiResponse {
  paciente: Patient;
}

export interface ObrasSocialesContextType {
  obrasSociales: string[];
  loading: boolean;
  error: string | null;
}