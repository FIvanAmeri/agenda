import { useState, useCallback, useEffect, useRef } from "react";
import { EstadoPago } from "../../components/interfaz/boton-pago";

export const useBotonPago = () => {
  const [cargando, setCargando] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [abierto, setAbierto] = useState<boolean>(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const estados: EstadoPago[] = ["no pagado", "parcialmente pagado", "pagado"];

  const obtenerLabel = (estado: EstadoPago): string => {
    if (estado === "no pagado") return "No pagado";
    if (estado === "parcialmente pagado") return "Parcialmente pagado";
    return "Pagado";
  };

  const obtenerEstiloEstado = (estado: EstadoPago) => {
    if (estado === "pagado") return "bg-green-500 hover:bg-green-600";
    if (estado === "parcialmente pagado") return "bg-yellow-500 hover:bg-yellow-600";
    return "bg-red-500 hover:bg-red-600";
  };

  const actualizarEstadoDePago = useCallback(
    async (idPaciente: number, nuevoEstado: EstadoPago) => {
      setCargando(true);
      setError(null);

      try {
        const respuesta = await fetch(
          `http://localhost:3001/api/paciente/pago/${idPaciente}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${localStorage.getItem("token") || ""}`
            },
            body: JSON.stringify({ estadoPago: nuevoEstado }),
          }
        );

        if (!respuesta.ok) {
          const errorData = await respuesta.json();
          throw new Error(errorData.message || "Error desconocido al actualizar el pago");
        }

        const data = await respuesta.json();
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

  useEffect(() => {
    const handleClickFuera = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAbierto(false);
      }
    };

    document.addEventListener("mousedown", handleClickFuera);
    return () => {
      document.removeEventListener("mousedown", handleClickFuera);
    };
  }, []);

  return {
    actualizarEstadoDePago,
    cargando,
    error,
    abierto,
    setAbierto,
    estados,
    obtenerLabel,
    obtenerEstiloEstado,
    dropdownRef,
  };
};
