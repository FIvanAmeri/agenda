import { ApiResponse, ForgotPasswordRequest, ForgotPasswordResponse, User, AuthResponse, RegisterResponse, LoginCredentials, ResetPayload } from '../components/interfaz/interfaz'

const handleApiCall = async <T>(url: string, method: string, body?: object): Promise<T> => {
  const defaultHeaders = { 'Content-Type': 'application/json' }

  const response = await fetch(url, {
    method,
    headers: defaultHeaders,
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => ({
    message: 'Respuesta inválida del servidor.'
  }))

  if (!response.ok) {
    const errorMessage = (data as { message?: string }).message || `Error ${response.status}: Error al conectar con el servidor.`
    throw new Error(errorMessage)
  }

  return data as T
}

export const useApi = () => {
  const API_BASE_URL = 'http://localhost:3001/api/users'

  const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const url = `${API_BASE_URL}/login`
    return await handleApiCall<AuthResponse>(url, 'POST', credentials)
  }

  const registerUser = async (userData: Pick<User, 'usuario' | 'email' | 'contrasena'>): Promise<RegisterResponse> => {
    const url = `${API_BASE_URL}/register`
    return await handleApiCall<RegisterResponse>(url, 'POST', userData)
  }

  const forgotPassword = async (payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    const url = `${API_BASE_URL}/forgot-password`
    return await handleApiCall<ForgotPasswordResponse>(url, 'POST', payload)
  }

  const resetPassword = async (payload: ResetPayload): Promise<ApiResponse> => {
    const url = `${API_BASE_URL}/reset-password`
    return await handleApiCall<ApiResponse>(url, 'POST', payload)
  }

  return {
    loginUser,
    registerUser,
    forgotPassword,
    resetPassword,
  }
}
