import { useState, useEffect } from "react";
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
        fechaNacimientoPaciente: "",
        tipoCirugia: "",
        medicoOpero: "",
        medicoAyudo1: "",
        medicoAyudo2: "",
        montoTotalHonorarios: "",
        montoTotalPresupuesto: "",
        descripcion: ""
    });

    const [error, setError] = useState<string | null>(null);
    const [medicos, setMedicos] = useState<string[]>([]);
    const [tiposCirugia, setTiposCirugia] = useState<string[]>([]);
    const [loadingLists, setLoadingLists] = useState<boolean>(true);

    useEffect(() => {
        const fetchLists = async (): Promise<void> => {
            const token: string | null = localStorage.getItem("token");
            if (!token) {
                setError("Usuario no autenticado. Por favor, inicie sesión.");
                setLoadingLists(false);
                return;
            }

            const headers: HeadersInit = { Authorization: `Bearer ${token}` };

            try {
                const [medicosRes, tiposRes] = await Promise.all([
                    fetch("http://localhost:3001/api/cirugia/medicos", { headers }),
                    fetch("http://localhost:3001/api/cirugia/tipos", { headers }),
                ]);

                const medicosData: { medicos: string[] } = await medicosRes.json();
                const tiposData: { tiposCirugia: string[] } = await tiposRes.json();

                if (medicosRes.ok && Array.isArray(medicosData.medicos)) {
                    setMedicos(medicosData.medicos);
                }

                if (tiposRes.ok && Array.isArray(tiposData.tiposCirugia)) {
                    setTiposCirugia(tiposData.tiposCirugia);
                }
            } catch (err: unknown) {
                setError("No se pudieron cargar las listas dinámicas (Médicos/Tipos de Cirugía)");
            } finally {
                setLoadingLists(false);
            }
        };

        fetchLists();
    }, [user.id]);


    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setFormData((prev: DatosFormularioCirugia) => ({
            ...prev,
            [name as keyof DatosFormularioCirugia]: value
        }));
    };

    const handleAddOption = (listName: ListaDinamica, fieldLabel: string): void => {
        const newOption: string | null = prompt(`Ingrese el nuevo valor para ${fieldLabel}:`);
        if (newOption && newOption.trim() !== "") {
            const listSetter: React.Dispatch<React.SetStateAction<string[]>> = listName === "medicos" ? setMedicos : setTiposCirugia;
            listSetter((prev: string[]) => (prev.includes(newOption) ? prev : [...prev, newOption]));
        }
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError(null);

        const token: string | null = localStorage.getItem("token");

        if (!token) {
            setError("Usuario no autenticado. Por favor, inicie sesión.");
            return;
        }
        
        const honorarios: number | null = formData.montoTotalHonorarios ? Number(formData.montoTotalHonorarios) : null;
        const presupuesto: number | null = formData.montoTotalPresupuesto ? Number(formData.montoTotalPresupuesto) : null;

        const cirugiaPayload: CirugiaPayload = {
            fecha: formData.fecha,
            paciente: formData.paciente,
            fechaNacimientoPaciente: formData.fechaNacimientoPaciente,
            tipoCirugia: formData.tipoCirugia,
            medicoOpero: formData.medicoOpero,
            medicoAyudo1: formData.medicoAyudo1,
            medicoAyudo2: formData.medicoAyudo2,
            montoTotalHonorarios: honorarios,
            montoTotalPresupuesto: presupuesto,
            descripcion: formData.descripcion,
            userId: Number(user.id)
        };

        try {
            const response: Response = await fetch("http://localhost:3001/api/cirugia", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(cirugiaPayload)
            });

            if (!response.ok) {
                const text: string = await response.text();
                throw new Error("Error al crear la cirugía: " + text);
            }

            window.alert("Cirugía ingresada correctamente");
            onAdded();
            onClose();

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Hubo un error al guardar la cirugía");
        }
    };

    return {
        formData,
        medicos,
        tiposCirugia,
        error,
        loadingLists,
        handleInputChange,
        handleAddOption,
        handleSubmit
    };
};