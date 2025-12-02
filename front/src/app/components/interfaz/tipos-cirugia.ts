import { User } from "../interfaz/interfaz"; 

export interface DatosFormularioCirugia {
    fecha: string;
    paciente: string;
    tipoCirugia: string;
    medicoOpero: string;
    medicoAyudo1: string;
    medicoAyudo2: string;
    honorarios: string;
    descripcion: string;
}

export interface CirugiaPayload {
    fecha: string;
    paciente: string;
    tipoCirugia: string;
    medicoOpero: string;
    medicoAyudo1: string;
    medicoAyudo2: string;
    honorarios: number;
    userId: number;
    descripcion: string;
}

export interface PropsFormularioCirugia {
    user: User;
    onAdded: () => void;
    onClose: () => void;
}

export interface PropsCampoSeleccionDinamico {
    nombre: keyof DatosFormularioCirugia;
    etiqueta: string;
    valor: string;
    opciones: string[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onAgregarOpcion: () => void;
    requerido: boolean;
    deshabilitado?: boolean;
}

type ListaDinamica = "medicos" | "tiposCirugia";


export interface ResultadoUsarFormularioCirugia {
    formData: DatosFormularioCirugia;
    medicos: string[];
    tiposCirugia: string[];
    error: string | null;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleAddOption: (listName: ListaDinamica, fieldLabel: string) => void;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
}