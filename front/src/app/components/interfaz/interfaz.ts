export default interface Patient {
  id: number;
  hora: string;
  paciente: string;
  practicas: string;
  obraSocial: string;
  dia: string;
  institucion: string;
}

export interface ObrasSocialesContextType {
  obrasSociales: string[];
  loading: boolean;
  error: string | null;
}