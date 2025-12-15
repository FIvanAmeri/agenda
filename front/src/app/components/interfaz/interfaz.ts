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
    montoPagadoHonorarios: number
    estadoPagoHonorarios: "no pagado" | "parcialmente pagado" | "pagado"

    montoTotalPresupuesto: number | null
    montoPagadoPresupuesto: number
    estadoPagoPresupuesto: "no pagado" | "parcialmente pagado" | "pagado"
}