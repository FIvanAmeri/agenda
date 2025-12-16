export interface ApiResponse {
    message: string
    error?: string
}

export interface ForgotPasswordResponse extends ApiResponse {
    success?: boolean
    email?: string
}

export interface ForgotPasswordRequest {
    email: string
}

export interface User {
    id?: string
    usuario: string
    contrasena?: string
    email?: string
}

export interface AuthResponse extends ApiResponse {
    user: User
}

export interface RegisterResponse extends ApiResponse {
    user?: User
}

export interface AuthContextType {
    login: (credentials: Pick<User, "usuario" | "contrasena">) => Promise<void>
    register: (data: Pick<User, "usuario" | "email" | "contrasena">) => Promise<void>
    logout: () => void
    token: string | null
    loading: boolean
}

export interface Patient {
    id: number
    hora: string
    dia: string
    paciente: string
    fechaNacimiento: string | null
    practicas: string
    obraSocial: string
    institucion: string
    userId: number
    estadoPago: "no pagado" | "parcialmente pagado" | "pagado" 
    montoPagado: number
    montoTotal: number
    fechaPagoParcial: string | null
    fechaPagoTotal: string | null
    // CORRECCIÓN: Se añaden las propiedades devueltas por el backend
    ultimoPagoParcial?: number
    ultimoPagoTotal?: number
}

export interface LoginCredentials {
    usuario: string
    contrasena: string
}

export interface ResetPayload {
    token: string
    newContrasena: string
}

export interface PatientFormData {
    dia: string
    hora: string
    paciente: string
    practicas: string
    obraSocial: string
    institucion: string
    estudioUrgoginecologico: boolean
}


export interface Cirugia {
    id: number 
    fecha: string
    paciente: string
    fechaNacimientoPaciente: string | null
    edadPaciente: number | null
    tipoCirugia: string
    obraSocial: string | null
    medicoOpero: string
    medicoAyudo1: string | null
    medicoAyudo2: string | null
    descripcion: string | null
    montoTotalHonorarios: number | null
    montoPagadoHonorarios: number | null
    estadoPagoHonorarios: "no pagado" | "parcialmente pagado" | "pagado"
    montoTotalPresupuesto: number | null
    montoPagadoPresupuesto: number | null
    estadoPagoPresupuesto: "no pagado" | "parcialmente pagado" | "pagado"
    userId: number
}

export interface CirugiaResponse extends ApiResponse {
    cirugias: Cirugia[]
    medicosOpciones: string[]
    tiposCirugiaOpciones: string[]
    obrasSocialesOpciones: string[]
}


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
    onCirugiaAdded: () => void
}

export interface CirugiaDetailModalProps {
    cirugia: Cirugia
    onClose: () => void
    onSubmit?: (cirugiaId: number, updatePayload: Partial<Cirugia>) => Promise<void>
    medicosOpciones?: string[]
    tiposCirugiaOpciones?: string[]
    obrasSocialesOpciones?: string[]
    showHonorarios: boolean
}