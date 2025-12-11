import { useState, useCallback } from "react";
import { Patient } from "../../components/interfaz/interfaz";
import { EstadoPago } from "../../components/interfaz/boton-pago";

interface RespuestaPago {
  paciente: Patient;
  message: string;
}

export const usePagos = () => {
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarPagoConMonto = useCallback(
    async (
      idPaciente: number,
      estadoPago: EstadoPago,
      monto: number,
      fechaPagoParcial: string | null,
      fechaPagoTotal: string | null
    ): Promise<Patient> => {
      setCargando(true);
      setError(null);

      try {
        const body = {
          estadoPago,
          monto,
          fechaPagoParcial,
          fechaPagoTotal,
        };

        const respuesta = await fetch(
          `http://localhost:3001/api/paciente/pago/${idPaciente}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
            },
            body: JSON.stringify(body),
          }
        );

        if (!respuesta.ok) {
          const errorData = await respuesta.json();
          throw new Error(errorData.message || "Error al actualizar pago");
        }

        const data: RespuestaPago = await respuesta.json();
        setCargando(false);

        return data.paciente;
      } catch (e: unknown) {
        setCargando(false);
        setError(e instanceof Error ? e.message : "Error desconocido");
        throw e;
      }
    },
    []
  );

  return {
    actualizarPagoConMonto,
    cargando,
    error,
  };
};
