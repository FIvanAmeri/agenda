"use client"

import React, { useState, useCallback, useMemo } from "react"
import { Cirugia, Patient, ListaDinamica, DatosFormularioCirugia } from "../../components/interfaz/interfaz"
import { FaTimes } from "react-icons/fa"
import { CirugiaFormGeneral } from "./CirugiaFormGeneral"
import { CirugiaFormDoctors } from "./CirugiaFormDoctors"
import { CirugiaFormFinance } from "./CirugiaFormFinance"
import { ModalAgregarOpcion } from "./ModalAgregarOpcion"

interface CirugiaDetailModalProps {
    cirugia: Cirugia
    onClose: () => void
    onSubmit: (id: number, payload: Partial<Cirugia>) => Promise<void>
    medicosOpciones: string[]
    tiposCirugiaOpciones: string[]
    obrasSocialesOpciones: string[]
    showHonorarios: boolean
    existingPatients?: Patient[]
}

export const CirugiaDetailModal: React.FC<CirugiaDetailModalProps> = ({
    cirugia,
    onClose,
    onSubmit,
    medicosOpciones,
    tiposCirugiaOpciones,
    obrasSocialesOpciones,
    showHonorarios,
    existingPatients = []
}) => {
    const initialFormData: DatosFormularioCirugia = {
        fecha: cirugia.fecha,
        paciente: cirugia.paciente,
        fechaNacimientoPaciente: cirugia.fechaNacimientoPaciente ?? "",
        tipoCirugia: cirugia.tipoCirugia,
        obraSocial: cirugia.obraSocial ?? "",
        medicoOpero: cirugia.medicoOpero,
        medicoAyudo1: cirugia.medicoAyudo1 ?? "",
        medicoAyudo2: cirugia.medicoAyudo2 ?? "",
        montoTotalHonorarios: cirugia.montoTotalHonorarios?.toString() ?? "0",
        montoTotalPresupuesto: cirugia.montoTotalPresupuesto?.toString() ?? "0",
        descripcion: cirugia.descripcion ?? ""
    }

    const [formData, setFormData] = useState<DatosFormularioCirugia>(initialFormData)
    const [error, setError] = useState<string | null>(null)
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [modalAbierto, setModalAbierto] = useState(false)
    const [etiquetaModal, setEtiquetaModal] = useState("")
    const [tipoColeccionModal, setTipoColeccionModal] = useState<ListaDinamica>("medicos")

    const [listas, setListas] = useState({
        medicos: medicosOpciones,
        tiposCirugia: tiposCirugiaOpciones,
        obrasSociales: obrasSocialesOpciones
    })

    const suggestions = useMemo(() => {
        const term = formData.paciente.toLowerCase().trim()
        if (term.length < 2 || !existingPatients.length) return []
        const uniqueNames = Array.from(new Set(existingPatients.map(p => p.paciente)))
        return uniqueNames
            .filter(name => name.toLowerCase().includes(term))
            .slice(0, 5)
    }, [formData.paciente, existingPatients])

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData((prev: DatosFormularioCirugia) => ({ ...prev, [name]: value }))
    }

    const handleSelectSuggestion = (name: string) => {
        setFormData((prev: DatosFormularioCirugia) => ({ ...prev, paciente: name }))
        setShowSuggestions(false)
    }

    const abrirModalAgregar = useCallback((tipoColeccion: ListaDinamica, etiqueta: string) => () => {
        setTipoColeccionModal(tipoColeccion)
        setEtiquetaModal(etiqueta)
        setModalAbierto(true)
    }, [])

    const guardarNuevaOpcion = (nuevoValor: string) => {
        setListas(prev => ({
            ...prev,
            [tipoColeccionModal]: [...prev[tipoColeccionModal], nuevoValor]
        }))
        setFormData((prev: DatosFormularioCirugia) => {
            const fieldMap: Record<ListaDinamica, keyof DatosFormularioCirugia> = {
                medicos: "medicoOpero",
                tiposCirugia: "tipoCirugia",
                obrasSociales: "obraSocial"
            }
            return { ...prev, [fieldMap[tipoColeccionModal]]: nuevoValor }
        })
        setModalAbierto(false)
    }

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        try {
            const updatePayload: Partial<Cirugia> = {
                fecha: formData.fecha,
                paciente: formData.paciente,
                fechaNacimientoPaciente: formData.fechaNacimientoPaciente || null,
                tipoCirugia: formData.tipoCirugia,
                obraSocial: formData.obraSocial || null,
                medicoOpero: formData.medicoOpero,
                medicoAyudo1: formData.medicoAyudo1 || null,
                medicoAyudo2: formData.medicoAyudo2 || null,
                montoTotalHonorarios: parseFloat(formData.montoTotalHonorarios) || 0,
                montoTotalPresupuesto: parseFloat(formData.montoTotalPresupuesto) || 0,
                descripcion: formData.descripcion || null
            }
            await onSubmit(cirugia.id, updatePayload)
            onClose()
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al actualizar")
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-hidden">
            <div className="bg-[#0F2A35] border border-cyan-900/50 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                
                {modalAbierto && (
                    <ModalAgregarOpcion 
                        etiqueta={etiquetaModal} 
                        onClose={() => setModalAbierto(false)} 
                        onSave={guardarNuevaOpcion} 
                    />
                )}

                <div className="p-6 bg-[#1a4553] flex justify-between items-center border-b border-cyan-800/50 flex-shrink-0">
                    <h2 className="text-2xl font-bold text-white">Editar Cirugía</h2>
                    <button onClick={onClose} className="text-white hover:text-red-400 transition" type="button">
                        <FaTimes className="text-2xl" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-700 text-white rounded-md text-sm">
                                Error: {error}
                            </div>
                        )}

                        <CirugiaFormGeneral 
                            formData={formData}
                            tiposCirugia={listas.tiposCirugia}
                            obrasSociales={listas.obrasSociales}
                            suggestions={suggestions}
                            showSuggestions={showSuggestions}
                            handleInputChange={handleInputChange}
                            handleSelectSuggestion={handleSelectSuggestion}
                            setShowSuggestions={setShowSuggestions}
                            abrirModalAgregar={abrirModalAgregar}
                        />

                        <CirugiaFormDoctors 
                            formData={formData}
                            medicos={listas.medicos}
                            handleInputChange={handleInputChange}
                            abrirModalAgregar={abrirModalAgregar}
                        />

                        {showHonorarios && (
                            <CirugiaFormFinance 
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        )}

                        <div className="flex justify-end space-x-3 pt-4 border-t border-cyan-800/50">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-[#1a4553] transition duration-200 text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-emerald-700 text-white font-semibold rounded-md hover:bg-emerald-600 transition duration-200 text-sm"
                            >
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CirugiaDetailModal