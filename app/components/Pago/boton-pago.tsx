"use client"

import React, { useState } from "react"
import type { EstadoPago, PacienteParaPago } from "../interfaz/pago-interfaces"
import type { Patient } from "../interfaz/interfaz"
import { useBotonPago } from "../../hooks/boton-pago/useBotonPago"
import { usePagos } from "../../hooks/pagos/usePagos"
import { PopUpMonto } from "../pop-up/Monto/PopUpMonto"

interface BotonPagoProps {
    paciente: PacienteParaPago
    onEstadoActualizado: (paciente: PacienteParaPago) => void
}

const mapPatientToPacienteParaPago = (p: Patient): PacienteParaPago => ({
    id: p.id,
    estadoPagoActual: p.estadoPago,
    montoPagadoActual: p.montoPagado,
    montoTotalActual: p.montoTotal,
    fechaPagoParcial: p.fechaPagoParcial,
    fechaPagoTotal: p.fechaPagoTotal,
    ultimoPagoParcial: p.ultimoPagoParcial,
    ultimoPagoTotal: p.ultimoPagoTotal,
})

const BotonPago: React.FC<BotonPagoProps> = ({ paciente, onEstadoActualizado }) => {
    const { actualizarPagoConMonto } = usePagos()
    const { abierto, setAbierto, estados, obtenerLabel, obtenerEstiloEstado, dropdownRef } =
        useBotonPago()

    const [mostrarPopUp, setMostrarPopUp] = useState<boolean>(false)
    const [estadoSeleccionado, setEstadoSeleccionado] = useState<EstadoPago | null>(null)

    const handleSeleccion = async (estado: EstadoPago) => {
        setAbierto(false)
        setEstadoSeleccionado(estado)

        if (estado === "parcialmente pagado" || estado === "pagado") {
            setMostrarPopUp(true)
            return
        }

        const actualizado: Patient = await actualizarPagoConMonto(
            paciente.id,
            "no pagado",
            0,
            null,
            null
        )

        onEstadoActualizado(mapPatientToPacienteParaPago(actualizado))
    }

    const handleGuardarMonto = async (monto: number, fechaInput: string) => {
        if (!estadoSeleccionado) return

        const hoy = new Date()
        const year = hoy.getFullYear()
        const month = String(hoy.getMonth() + 1).padStart(2, '0')
        const day = String(hoy.getDate()).padStart(2, '0')
        const fechaLocal = `${year}-${month}-${day}`

        const fechaFinal = fechaInput || fechaLocal

        const fechaParcial =
            estadoSeleccionado === "parcialmente pagado" ? fechaFinal : null

        const fechaTotal =
            estadoSeleccionado === "pagado" ? fechaFinal : null

        const actualizado: Patient = await actualizarPagoConMonto(
            paciente.id,
            estadoSeleccionado,
            monto,
            fechaParcial,
            fechaTotal
        )

        onEstadoActualizado(mapPatientToPacienteParaPago(actualizado))
        setMostrarPopUp(false)
        setEstadoSeleccionado(null)
    }

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
                    montoAcumulado={paciente.montoPagadoActual}
                    montoTotalPrevisto={paciente.montoTotalActual}
                    onGuardar={handleGuardarMonto}
                    onCancelar={() => {
                        setMostrarPopUp(false)
                        setEstadoSeleccionado(null)
                    }}
                />
            )}
        </div>
    )
}

export default BotonPago