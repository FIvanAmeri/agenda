export default interface Patient {
  id: string;
  dia: string;
  paciente: string;
  practicas: string;
  obraSocial: string;
  institucion: string;
}




export interface ObrasSocialesContextType {
  obrasSociales: string[];
  loading: boolean;
  error: string | null;
}
