import { useState, useCallback } from "react";
import { Patient } from "../../components/interfaz/interfaz";
import { EstadoPago } from "../../components/interfaz/boton-pago";

interface RespuestaPago {
  paciente: Patient;
  message: string;
}

export const usePagos = () => {
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const actualizarPagoConMonto = useCallback(
    async (idPaciente: number, nuevoEstado: EstadoPago, montoDelta?: number): Promise<Patient> => {
      setCargando(true);
      setError(null);

      try {
        const cuerpoSolicitud: { estadoPago: EstadoPago; monto?: number } = {
          estadoPago: nuevoEstado,
        };

        if (montoDelta !== undefined && (nuevoEstado === "parcialmente pagado" || nuevoEstado === "pagado")) {
          cuerpoSolicitud.monto = montoDelta;
        } else if (nuevoEstado === "no pagado") {
          cuerpoSolicitud.monto = 0;
        }

        const respuesta = await fetch(
          `http://localhost:3001/api/paciente/pago/${idPaciente}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
            },
            body: JSON.stringify(cuerpoSolicitud),
          }
        );

        if (!respuesta.ok) {
          const errorData = await respuesta.json();
          throw new Error(errorData.message || "Error desconocido al actualizar el pago");
        }

        const data: RespuestaPago = await respuesta.json();
        setCargando(false);

        return data.paciente;
      } catch (e: unknown) {
        setCargando(false);
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError("Ocurrió un error inesperado");
        }
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