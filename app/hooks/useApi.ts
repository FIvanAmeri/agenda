import { 
  ApiResponse, 
  ForgotPasswordRequest, 
  ForgotPasswordResponse, 
  User, 
  AuthResponse, 
  RegisterResponse, 
  LoginCredentials, 
  ResetPayload 
} from '../components/interfaz/interfaz'

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
    const errorMsg = (data as { message?: string; error?: string }).message || 
                     (data as { message?: string; error?: string }).error || 
                     `Error ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T
}

export const useApi = () => {
  const AUTH_BASE_URL = '/api/auth'

  const loginUser = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    return await handleApiCall<AuthResponse>(`${AUTH_BASE_URL}/login`, 'POST', credentials)
  }

  const registerUser = async (userData: Pick<User, 'usuario' | 'email' | 'contrasena'>): Promise<RegisterResponse> => {
    return await handleApiCall<RegisterResponse>(`${AUTH_BASE_URL}/register`, 'POST', userData)
  }

  const forgotPassword = async (payload: ForgotPasswordRequest): Promise<ForgotPasswordResponse> => {
    return await handleApiCall<ForgotPasswordResponse>(`${AUTH_BASE_URL}/forgot-password`, 'POST', payload)
  }

  const resetPassword = async (payload: ResetPayload): Promise<ApiResponse> => {
    return await handleApiCall<ApiResponse>(`${AUTH_BASE_URL}/reset-password`, 'POST', payload)
  }

  return {
    loginUser,
    registerUser,
    forgotPassword,
    resetPassword,
  }
}