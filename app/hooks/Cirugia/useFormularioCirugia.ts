"use client";

import { useState, useEffect, useCallback } from "react";
import { 
    DatosFormularioCirugia, 
    CirugiaPayload, 
    PropsFormularioCirugia, 
    ResultadoUsarFormularioCirugia,
    ListaDinamica
} from "../../components/interfaz/interfaz";
import { useObrasSociales } from "../../context/ObrasSocialesContext";
import { formatDate } from "../../utilidades/dateTimeHelpers"; 

export const useFormularioCirugia = ({ user, onAdded, onClose }: PropsFormularioCirugia): ResultadoUsarFormularioCirugia => {
    
    const { obrasSociales, setObrasSociales } = useObrasSociales();

    const [formData, setFormData] = useState<DatosFormularioCirugia>({
        fecha: formatDate(new Date().toISOString()),
        paciente: "",
        fechaNacimientoPaciente: "",
        tipoCirugia: "",
        obraSocial: "",
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

    const fetchLists = useCallback(async (): Promise<void> => {
        const token: string | null = localStorage.getItem("token");
        if (!token) {
            setError("Usuario no autenticado. Por favor, inicie sesión.");
            setLoadingLists(false);
            return;
        }

        const headers: HeadersInit = { Authorization: `Bearer ${token}` };
        const queryParams = `?usuarioId=${user.id}`;

        try {
            const [medicosRes, tiposRes, osRes] = await Promise.all([
                fetch(`/api/cirugias/medicos${queryParams}`, { headers }),
                fetch(`/api/cirugias/tipos${queryParams}`, { headers }),
                fetch(`/api/cirugias/obras-sociales${queryParams}`, { headers })
            ]);

            if (!medicosRes.ok || !tiposRes.ok || !osRes.ok) {
                throw new Error("Error en la respuesta del servidor");
            }

            const medicosData: { medicos: string[] } = await medicosRes.json();
            const tiposData: { tiposCirugia: string[] } = await tiposRes.json();
            const osData: { obrasSociales: string[] } = await osRes.json();

            setMedicos(Array.isArray(medicosData.medicos) ? medicosData.medicos : []);
            setTiposCirugia(Array.isArray(tiposData.tiposCirugia) ? tiposData.tiposCirugia : []);
            setObrasSociales(Array.isArray(osData.obrasSociales) ? osData.obrasSociales : []);
            
            setError(null);
        } catch (err) {
            setError("No se pudieron cargar las listas dinámicas (Médicos/Tipos de Cirugía)");
        } finally {
            setLoadingLists(false);
        }
    }, [user.id, setObrasSociales]);

    useEffect(() => {
        if (user.id) {
            fetchLists();
        }
    }, [user.id, fetchLists]);

    const handleInputChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setFormData((prev: DatosFormularioCirugia) => ({
            ...prev,
            [name]: value
        }));
    }, []);

    const handleAddOption = useCallback((listName: ListaDinamica, nuevoValor: string): void => {
        const trimmedOption: string = nuevoValor.trim().toUpperCase();
        if (!trimmedOption) return;
            
        if (listName === "medicos") {
            setMedicos((prev: string[]) => (prev.includes(trimmedOption) ? prev : [...prev, trimmedOption].sort()));
            setFormData(prev => ({ ...prev, medicoOpero: trimmedOption }));
        } else if (listName === "tiposCirugia") {
            setTiposCirugia((prev: string[]) => (prev.includes(trimmedOption) ? prev : [...prev, trimmedOption].sort()));
            setFormData(prev => ({ ...prev, tipoCirugia: trimmedOption }));
        } else if (listName === "obrasSociales") {
            setObrasSociales((prev: string[]) => (prev.includes(trimmedOption) ? prev : [...prev, trimmedOption].sort()));
            setFormData(prev => ({ ...prev, obraSocial: trimmedOption }));
        }
    }, [setObrasSociales]);

    const handleSubmit = useCallback(async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        setError(null);

        const token: string | null = localStorage.getItem("token");
        if (!token) {
            setError("Sesión expirada.");
            return;
        }
        
        const cirugiaPayload: CirugiaPayload = {
            fecha: formData.fecha,
            paciente: formData.paciente,
            fechaNacimientoPaciente: formData.fechaNacimientoPaciente,
            tipoCirugia: formData.tipoCirugia,
            obraSocial: formData.obraSocial,
            medicoOpero: formData.medicoOpero,
            medicoAyudo1: formData.medicoAyudo1,
            medicoAyudo2: formData.medicoAyudo2,
            montoTotalHonorarios: formData.montoTotalHonorarios ? Number(formData.montoTotalHonorarios) : null,
            montoTotalPresupuesto: formData.montoTotalPresupuesto ? Number(formData.montoTotalPresupuesto) : null,
            descripcion: formData.descripcion,
            userId: Number(user.id)
        };

        try {
            const response: Response = await fetch("/api/cirugias", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(cirugiaPayload)
            });

            if (!response.ok) {
                const text = await response.text();
                throw new Error(text || "Error al guardar");
            }

            window.alert("Cirugía ingresada correctamente");
            onAdded();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al guardar la cirugía");
        }
    }, [formData, user.id, onAdded, onClose]);

    return {
        formData,
        medicos,
        tiposCirugia,
        obrasSociales,
        error,
        loadingLists,
        handleInputChange,
        handleAddOption,
        handleSubmit
    };
};