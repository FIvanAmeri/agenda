"use client";

import React, { useState } from "react";
import { EstadoPago, PacienteParaPago } from "../interfaz/boton-pago";
import { Patient } from "../interfaz/interfaz";
import { useBotonPago } from "../../hooks/boton-pago/useBotonPago";
import { usePagos } from "../../hooks/pagos/usePagos";
import { PopUpMonto } from "../pop-up/Monto/PopUpMonto";

interface BotonPagoProps {
  paciente: PacienteParaPago;
  onEstadoActualizado: (paciente: PacienteParaPago) => void;
}

const mapPatientToPacienteParaPago = (p: Patient): PacienteParaPago => ({
  id: p.id,
  estadoPagoActual: p.estadoPago,
  montoPagadoActual: p.montoPagado,
  montoTotalActual: p.montoTotal,
  fechaPagoParcial: p.fechaPagoParcial,
  fechaPagoTotal: p.fechaPagoTotal,
  ultimoPagoParcial: (p as unknown as Record<string, unknown>).ultimoPagoParcial as number | undefined,
  ultimoPagoTotal: (p as unknown as Record<string, unknown>).ultimoPagoTotal as number | undefined,
});

const BotonPago: React.FC<BotonPagoProps> = ({ paciente, onEstadoActualizado }) => {
  const { actualizarPagoConMonto } = usePagos();
  const { abierto, setAbierto, estados, obtenerLabel, obtenerEstiloEstado, dropdownRef } =
    useBotonPago();

  const [mostrarPopUp, setMostrarPopUp] = useState(false);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<EstadoPago | null>(null);

  const handleSeleccion = async (estado: EstadoPago) => {
    setAbierto(false);
    setEstadoSeleccionado(estado);

    if (estado === "parcialmente pagado" || estado === "pagado") {
      setMostrarPopUp(true);
      return;
    }

    const actualizado: Patient = await actualizarPagoConMonto(
      paciente.id,
      "no pagado",
      0,
      null,
      null
    );

    onEstadoActualizado(mapPatientToPacienteParaPago(actualizado));
  };

  const handleGuardarMonto = async (monto: number, fecha: string) => {
    if (!estadoSeleccionado) return;

    const fechaParcial =
      estadoSeleccionado === "parcialmente pagado" ? fecha : paciente.fechaPagoParcial ?? null;

    const fechaTotal =
      estadoSeleccionado === "pagado" ? fecha : paciente.fechaPagoTotal ?? null;

    const actualizado: Patient = await actualizarPagoConMonto(
      paciente.id,
      estadoSeleccionado,
      monto,
      fechaParcial,
      fechaTotal
    );

    onEstadoActualizado(mapPatientToPacienteParaPago(actualizado));
    setMostrarPopUp(false);
    setEstadoSeleccionado(null);
  };

  return (
    <div className="relative flex flex-col items-center">
      <button
        className={`px-4 py-2 text-white rounded w-48 text-center ${obtenerEstiloEstado(
          paciente.estadoPagoActual
        )}`}
        onClick={() => setAbierto(!abierto)}
      >
        {obtenerLabel(paciente.estadoPagoActual)}
      </button>

      {abierto && (
        <div
          ref={dropdownRef}
          className="absolute mt-2 bg-gray-800 text-white rounded shadow-lg w-48 z-20"
        >
          {estados.map((estado) => (
            <button
              key={estado}
              onClick={() => handleSeleccion(estado)}
              className="block w-full text-left px-4 py-2 hover:bg-gray-700"
            >
              {obtenerLabel(estado)}
            </button>
          ))}
        </div>
      )}

      {mostrarPopUp && (
        <PopUpMonto
          titulo={
            estadoSeleccionado === "parcialmente pagado"
              ? "Monto del Pago Parcial"
              : "Monto Total Pagado"
          }
          onGuardar={handleGuardarMonto}
          onCancelar={() => {
            setMostrarPopUp(false);
            setEstadoSeleccionado(null);
          }}
        />
      )}
    </div>
  );
};

export default BotonPago;
