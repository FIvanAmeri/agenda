import { User, Cirugia } from "../interfaz/interfaz"; 
import React from "react";

export interface DatosFormularioCirugia {
    fecha: string
    paciente: string
    fechaNacimientoPaciente: string
    tipoCirugia: string
    obraSocial: string
    medicoOpero: string
    medicoAyudo1: string
    medicoAyudo2: string
    montoTotalHonorarios: string
    montoTotalPresupuesto: string
    descripcion: string
}

export interface CirugiaPayload {
    fecha: string
    paciente: string
    fechaNacimientoPaciente: string
    tipoCirugia: string
    obraSocial: string
    medicoOpero: string
    medicoAyudo1: string
    medicoAyudo2: string
    montoTotalHonorarios: number | null
    montoTotalPresupuesto: number | null
    userId: number
    descripcion: string
}

export interface PropsFormularioCirugia {
    user: User
    onAdded: () => void
    onClose: () => void
}

export interface PropsCampoSeleccionDinamico {
    nombre: keyof DatosFormularioCirugia
    etiqueta: string
    valor: string
    opciones: string[]
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    onAgregarOpcion: () => void
    requerido: boolean
    deshabilitado?: boolean
}

export type ListaDinamica = "medicos" | "tiposCirugia" | "obrasSociales";


export interface ResultadoUsarFormularioCirugia {
    formData: DatosFormularioCirugia
    medicos: string[]
    tiposCirugia: string[]
    obrasSociales: string[]
    error: string | null
    loadingLists: boolean
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void
    handleAddOption: (listName: ListaDinamica, fieldLabel: string) => void
    handleSubmit: (e: React.FormEvent) => Promise<void>
}

export interface FiltrosCirugia {
    dateFrom: string
    dateTo: string
    selectedPatientName: string
    selectedTipoCirugia: string
    selectedMedico: string
    selectedStatus: "pagado" | "no pagado" | ""
    selectedObraSocial: string
}

export interface PropsFiltroCirugia {
    filters: FiltrosCirugia
    setFilters: React.Dispatch<React.SetStateAction<FiltrosCirugia>>
    cirugias: Cirugia[]
    medicosOpciones: string[]
    tiposCirugiaOpciones: string[]
    obrasSocialesOpciones: string[]
}

export interface CirugiaDetailModalProps {
    cirugia: Cirugia
    onClose: () => void
    onSubmit: (cirugiaId: number, updatePayload: Partial<Cirugia>) => Promise<void>
    medicosOpciones: string[]
    tiposCirugiaOpciones: string[]
    obrasSocialesOpciones: string[]
}