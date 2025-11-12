import { useState } from "react"
import { ApiResponse } from "../../components/interfaz/interfaz"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/auth"

export default function useResetPassword() {
  const [loading, setLoading] = useState(false)

  const resetPassword = async (token: string, newPassword: string): Promise<ApiResponse> => {
    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newContrasena: newPassword }),
      })

      const data: ApiResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Error al restablecer la contraseña.")
      }

      return data
    } catch (error) {
      if (error instanceof Error) {
        return { message: error.message, error: error.message }
      }
      return { message: "Error desconocido" }
    } finally {
      setLoading(false)
    }
  }

  return { resetPassword, loading }
}
