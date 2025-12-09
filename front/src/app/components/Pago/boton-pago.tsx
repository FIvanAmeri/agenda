"use client";

import React from "react";
import { FaMoneyBillWave, FaChevronDown, FaSpinner } from "react-icons/fa";
import { EstadoPago, PacienteParaPago } from "../interfaz/boton-pago";
import { useBotonPago } from "../../hooks/boton-pago/useBotonPago";

interface BotonPagoProps {
  paciente: PacienteParaPago;
  onEstadoActualizado: (pacienteActualizado: PacienteParaPago) => void;
}

const BotonPago: React.FC<BotonPagoProps> = ({ paciente, onEstadoActualizado }) => {
  const {
    actualizarEstadoDePago,
    cargando,
    error,
    abierto,
    setAbierto,
    estados,
    obtenerLabel,
    obtenerEstiloEstado,
    dropdownRef,
  } = useBotonPago();

  const handleSeleccionarEstado = async (nuevoEstado: EstadoPago) => {
    setAbierto(false);
    if (nuevoEstado === paciente.estadoPagoActual) return;

    const pacienteActualizado = await actualizarEstadoDePago(
      paciente.id,
      nuevoEstado
    );


    onEstadoActualizado({
      id: paciente.id,
      estadoPagoActual: nuevoEstado,
    });
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setAbierto(!abierto)}
        disabled={cargando}
        className={`inline-flex justify-center items-center w-full rounded-lg border border-transparent shadow-md px-4 py-2 text-sm font-medium text-white transition duration-150 ease-in-out ${obtenerEstiloEstado(
          paciente.estadoPagoActual
        )} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-blue-500`}
      >
        {cargando ? <FaSpinner className="animate-spin mr-2" /> : <FaMoneyBillWave className="mr-2" />}
        {obtenerLabel(paciente.estadoPagoActual)}
        <FaChevronDown
          className={`ml-2 -mr-1 h-3 w-3 transition-transform duration-200 ${
            abierto ? "rotate-180" : ""
          }`}
        />
      </button>

      {abierto && (
        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
          <div className="py-1">
            <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase border-b border-gray-100">
              Cambiar Estado
            </div>

            {estados.map((estado) => (
              <button
                key={estado}
                onClick={() => handleSeleccionarEstado(estado)}
                className={`block w-full text-left px-4 py-2 text-sm ${
                  estado === paciente.estadoPagoActual
                    ? "bg-gray-100 text-gray-900 font-bold"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {obtenerLabel(estado)}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-2 text-sm text-red-600 p-2 bg-red-100 rounded-lg">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default BotonPago;
