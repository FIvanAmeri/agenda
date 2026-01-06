import { useState } from "react";
import { ForgotPasswordRequest, ForgotPasswordResponse } from "../../components/interfaz/interfaz";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/auth";

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

      if (!response.ok) {
        const errorData: ForgotPasswordResponse = await response.json();
        throw new Error(errorData.error || "Error al procesar la solicitud.");
      }

      const data: ForgotPasswordResponse = await response.json();
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
