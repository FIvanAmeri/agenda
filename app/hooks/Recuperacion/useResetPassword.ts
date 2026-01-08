import { useState } from "react";
import api from "@/app/services/api";
import { ApiResponse } from "../../components/interfaz/interfaz";
import axios from "axios";

export default function useResetPassword() {
  const [loading, setLoading] = useState(false);

  const resetPassword = async (token: string, newPassword: string): Promise<ApiResponse> => {
    setLoading(true);
    try {
      const response = await api.post<ApiResponse>("/auth/reset-password", {
        token,
        newContrasena: newPassword
      });
      return response.data;
    } catch (error) {
      let message = "Error al restablecer la contraseña.";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        message = error.response.data.error;
      } else if (error instanceof Error) {
        message = error.message;
      }
      return { message, error: message };
    } finally {
      setLoading(false);
    }
  };

  return { resetPassword, loading };
}