import { useState } from "react";
import { 
    DatosFormularioCirugia, 
    CirugiaPayload, 
    PropsFormularioCirugia, 
    ResultadoUsarFormularioCirugia 
} from "../../components/interfaz/tipos-cirugia";

import { formatDate } from "../../utils/dateTimeHelpers"; 

type ListaDinamica = "medicos" | "tiposCirugia";

export const usarFormularioCirugia = ({ user, onAdded, onClose }: PropsFormularioCirugia): ResultadoUsarFormularioCirugia => {
    
    const [formData, setFormData] = useState<DatosFormularioCirugia>({
        fecha: formatDate(new Date().toISOString()),
        paciente: "",
        tipoCirugia: "",
        medicoOpero: "",
        medicoAyudo1: "",
        medicoAyudo2: "",
        honorarios: "",
        descripcion: ""
    });

    const [error, setError] = useState<string | null>(null);
    const [medicos, setMedicos] = useState<string[]>([]);
    const [tiposCirugia, setTiposCirugia] = useState<string[]>([]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name as keyof DatosFormularioCirugia]: value
        }));
    };

    const handleAddOption = (listName: ListaDinamica, fieldLabel: string) => {
        const newOption = prompt(`Ingrese el nuevo valor para ${fieldLabel}:`);
        if (newOption && newOption.trim() !== "") {
            const listSetter = listName === "medicos" ? setMedicos : setTiposCirugia;
            listSetter(prev => (prev.includes(newOption) ? prev : [...prev, newOption]));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const token = localStorage.getItem("token");

        if (!token) {
            setError("Usuario no autenticado. Por favor, inicie sesión.");
            return;
        }

        const cirugiaPayload: CirugiaPayload = {
            ...formData,
            honorarios: Number(formData.honorarios),
            userId: Number(user.id)
        };

        try {
            const response = await fetch("http://localhost:3001/api/cirugia", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(cirugiaPayload)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error("Error al crear la cirugía: " + text);
            }

            window.alert("Cirugía ingresada correctamente");
            onAdded();
            onClose();

        } catch (err) {
            setError(err instanceof Error ? err.message : "Hubo un error al guardar la cirugía");
        }
    };

    return {
        formData,
        medicos,
        tiposCirugia,
        error,
        handleInputChange,
        handleAddOption,
        handleSubmit
    };
};