"use client"

import React, { useState, useEffect } from "react"

interface PopUpMontoProps {
    onGuardar: (monto: number, fecha: string) => void
    onCancelar: () => void
    titulo?: string
    montoAcumulado: number
    montoTotalPrevisto: number
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount)
}

export const PopUpMonto: React.FC<PopUpMontoProps> = ({
    onGuardar,
    onCancelar,
    titulo = "Monto",
    montoAcumulado,
    montoTotalPrevisto
}) => {
    const [monto, setMonto] = useState("")
    const [fecha, setFecha] = useState("")

    useEffect(() => {
        const hoy = new Date()
        const year = hoy.getFullYear()
        const month = String(hoy.getMonth() + 1).padStart(2, '0')
        const day = String(hoy.getDate()).padStart(2, '0')
        const fechaLocal = `${year}-${month}-${day}`
        setFecha(fechaLocal)
    }, [])

    const handleGuardar = () => {
        const n = Number(monto)
        if (!isNaN(n) && n >= 0 && fecha) {
            onGuardar(n, fecha)
        }
    }

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div className="w-96 p-6 rounded-2xl shadow-[0_8px_25px_rgba(0,0,0,0.15)] 
                            bg-[#f7efe5] border border-[#e2d6c9]">

                <h2 className="text-2xl font-semibold text-[#5c4a3f] mb-5">
                    {titulo}
                </h2>

                <div className="mb-4 p-3 rounded-lg bg-[#e2d6c9] border border-[#d4c7ba]">
                    <p className="text-sm text-[#5c4a3f] mb-1">Monto Pagado Acumulado:</p>
                    <p className="text-lg font-bold text-[#228B22]">
                        {formatCurrency(montoAcumulado)}
                    </p>
                </div>

                <input
                    type="number"
                    className="w-full p-3 rounded-lg border border-[#d4c7ba] 
                               bg-[#fffaf5] text-[#4a3c31] focus:outline-none
                               focus:ring-2 focus:ring-[#c7a27e] mb-4"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    placeholder="Ingrese el monto a pagar ahora"
                />

                <input
                    type="date"
                    className="w-full p-3 rounded-lg border border-[#d4c7ba] 
                               bg-[#fffaf5] text-[#4a3c31] focus:outline-none
                               focus:ring-2 focus:ring-[#c7a27e]"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                />

                <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={handleGuardar}
                        className="px-4 py-2 rounded-lg bg-[#c7a27e] 
                                         hover:bg-[#b8926d] text-white font-medium"
                    >
                        Guardar
                    </button>

                    <button
                        onClick={onCancelar}
                        className="px-4 py-2 rounded-lg bg-[#e2d6c9] 
                                         hover:bg-[#d4c7ba] text-[#4a3c31] font-medium"
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </div>
    )
}