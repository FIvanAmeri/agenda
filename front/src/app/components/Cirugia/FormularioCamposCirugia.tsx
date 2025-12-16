"use client";

import React, { useState, useCallback } from "react";
import { PropsFormularioCirugia, ListaDinamica } from "../../components/interfaz/interfaz";
import { usarFormularioCirugia } from "../../hooks/Cirugia/useFormularioCirugia";
import { CampoSeleccionDinamico } from "./CampoSeleccionDinamico";
import { FaTimes } from "react-icons/fa";
import { ModalAgregarOpcion } from "./ModalAgregarOpcion";

export const FormularioCamposCirugia: React.FC<PropsFormularioCirugia> = ({ user, onAdded, onClose }) => {
    const {
        formData,
        medicos,
        tiposCirugia,
        obrasSociales,
        error,
        handleInputChange,
        handleAddOption,
        handleSubmit
    } = usarFormularioCirugia({ user, onAdded, onClose });

    const [modalAbierto, setModalAbierto] = useState(false);
    const [etiquetaModal, setEtiquetaModal] = useState("");
    const [tipoColeccionModal, setTipoColeccionModal] = useState<ListaDinamica>("medicos");

    const abrirModalAgregar = useCallback((tipoColeccion: ListaDinamica, etiqueta: string) => () => {
        setTipoColeccionModal(tipoColeccion);
        setEtiquetaModal(etiqueta);
        setModalAbierto(true);
    }, []);

    const cerrarModalAgregar = () => {
        setModalAbierto(false);
        setEtiquetaModal("");
    };

    const guardarNuevaOpcion = (nuevoValor: string) => {
        handleAddOption(tipoColeccionModal, nuevoValor);
        cerrarModalAgregar();
    };

    return (
        <div className="bg-[#0F2A35] rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 border-2 border-[#004d40]">
            
            {modalAbierto && (
                <ModalAgregarOpcion 
                    etiqueta={etiquetaModal} 
                    onClose={cerrarModalAgregar} 
                    onSave={guardarNuevaOpcion} 
                />
            )}
            
            <div className="sticky top-0 bg-gradient-to-r from-[#004d40] to-[#1a4553] p-4 flex justify-between items-center text-white flex-shrink-0">
                <h2 className="text-2xl font-bold">Nueva Cirugía</h2>
                <button onClick={onClose} className="text-white hover:text-red-400 transition p-1 rounded-full hover:bg-black hover:bg-opacity-20">
                    <FaTimes className="text-xl" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 bg-red-700 text-white rounded-md">
                            Error: {error}
                        </div>
                    )}

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-cyan-400">Datos Generales</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Cirugía</label>
                                <input
                                    type="date"
                                    name="fecha"
                                    value={formData.fecha}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Nombre del Paciente</label>
                                <input
                                    type="text"
                                    name="paciente"
                                    value={formData.paciente}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    name="fechaNacimientoPaciente"
                                    value={formData.fechaNacimientoPaciente}
                                    onChange={handleInputChange}
                                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                            
                            <div className="md:col-span-3">
                                <CampoSeleccionDinamico
                                    nombre="tipoCirugia"
                                    etiqueta="Tipo de Cirugía"
                                    valor={formData.tipoCirugia}
                                    opciones={tiposCirugia}
                                    onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                                    onAgregarOpcion={abrirModalAgregar("tiposCirugia", "Tipo de Cirugía")}
                                    requerido={true}
                                />
                            </div>
                            
                            <div className="md:col-span-3">
                                <CampoSeleccionDinamico
                                    nombre="obraSocial"
                                    etiqueta="Obra Social"
                                    valor={formData.obraSocial}
                                    opciones={obrasSociales}
                                    onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                                    onAgregarOpcion={abrirModalAgregar("obrasSociales", "Obra Social")}
                                    requerido={false}
                                />
                            </div>

                            <div className="col-span-full">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                        </div>
                    </div>

                    <fieldset className="p-4 border border-[#1f3b47] rounded-lg space-y-4">
                        <legend className="text-lg font-semibold text-cyan-400 px-2">Médicos Participantes</legend>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <CampoSeleccionDinamico
                                nombre="medicoOpero"
                                etiqueta="Médico que Operó"
                                valor={formData.medicoOpero}
                                opciones={medicos}
                                onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                                onAgregarOpcion={abrirModalAgregar("medicos", "Médico que Operó")}
                                requerido={true}
                            />

                            <CampoSeleccionDinamico
                                nombre="medicoAyudo1"
                                etiqueta="Médico Ayudante 1"
                                valor={formData.medicoAyudo1}
                                opciones={medicos}
                                onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                                onAgregarOpcion={abrirModalAgregar("medicos", "Médico Ayudante 1")}
                                requerido={false}
                            />

                            <CampoSeleccionDinamico
                                nombre="medicoAyudo2"
                                etiqueta="Médico Ayudante 2"
                                valor={formData.medicoAyudo2}
                                opciones={medicos}
                                onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                                onAgregarOpcion={abrirModalAgregar("medicos", "Médico Ayudante 2")}
                                requerido={false}
                            />
                        </div>
                    </fieldset>


                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        <fieldset className="p-4 border border-[#1f3b47] rounded-lg space-y-4">
                            <legend className="text-lg font-semibold text-cyan-400 px-2">Honorarios</legend>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Monto Total</label>
                                <input
                                    type="number"
                                    name="montoTotalHonorarios"
                                    value={formData.montoTotalHonorarios}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                        </fieldset>

                        <fieldset className="p-4 border border-[#1f3b47] rounded-lg space-y-4">
                            <legend className="text-lg font-semibold text-cyan-400 px-2">Presupuesto</legend>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Monto Total</label>
                                <input
                                    type="number"
                                    name="montoTotalPresupuesto"
                                    value={formData.montoTotalPresupuesto}
                                    onChange={handleInputChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                        </fieldset>

                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t border-[#1f3b47]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-[#1a4553] transition duration-200"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#0c4a34] text-white font-semibold rounded-md hover:bg-[#1f5666] transition duration-200"
                        >
                            Guardar Cirugía
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};