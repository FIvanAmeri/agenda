import { Cirugia } from "../../components/interfaz/interfaz";

export interface BaseDetailProps {
    formData: Partial<Cirugia>;
}

export interface InputHandlersProps {
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleNumericChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface OptionsProps {
    medicosOpciones: string[];
    tiposCirugiaOpciones: string[];
    obrasSocialesOpciones: string[];
}

export interface CirugiaDetailFormFieldsProps extends BaseDetailProps, InputHandlersProps, OptionsProps {}