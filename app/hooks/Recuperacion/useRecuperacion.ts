import { useState } from "react";
import { ForgotPasswordRequest, ForgotPasswordResponse } from "../../components/interfaz/interfaz";


const API_URL = "/api/auth"; 

export default function useRecuperacion() {
  const [loading, setLoading] = useState(false);

  const requestReset = async (email: string): Promise<ForgotPasswordResponse> => {
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email } as ForgotPasswordRequest),
      });

      const data: ForgotPasswordResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error al procesar la solicitud.");
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        return { message: error.message, error: error.message };
      }
      return { message: "Error desconocido" };
    } finally {
      setLoading(false);
    }
  };

  return { requestReset, loading };
}