"use client";

import React from "react";
import { PropsFormularioCirugia } from "../../components/interfaz/tipos-cirugia";
import { usarFormularioCirugia } from "../../hooks/Cirugia/usarFormularioCirugia";
import { CampoSeleccionDinamico } from "./CampoSeleccionDinamico";

export const FormularioCamposCirugia: React.FC<PropsFormularioCirugia> = ({ user, onAdded, onClose }) => {
    const {
        formData,
        medicos,
        tiposCirugia,
        error,
        handleInputChange,
        handleAddOption,
        handleSubmit
    } = usarFormularioCirugia({ user, onAdded, onClose });

    
    const agregarMedico = (label: string) => () => handleAddOption("medicos", label);
    const agregarTipoCirugia = (label: string) => () => handleAddOption("tiposCirugia", label);

    return (
        <form onSubmit={handleSubmit}>
            {error && (
                <div className="mb-4 p-3 bg-red-800 text-white rounded-md">
                    Error: {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Fecha</label>
                        <input
                            type="date"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md text-black"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Nombre del Paciente</label>
                        <input
                            type="text"
                            name="paciente"
                            value={formData.paciente}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md text-black"
                        />
                    </div>

                    <CampoSeleccionDinamico
                        nombre="tipoCirugia"
                        etiqueta="Tipo de Cirugía"
                        valor={formData.tipoCirugia}
                        opciones={tiposCirugia}
                        onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                        onAgregarOpcion={agregarTipoCirugia("Tipo de Cirugía")}
                        requerido={true}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Honorarios</label>
                        <input
                            type="number"
                            name="honorarios"
                            value={formData.honorarios}
                            onChange={handleInputChange}
                            placeholder="0"
                            className="w-full p-2 border border-gray-300 rounded-md text-black"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <CampoSeleccionDinamico
                        nombre="medicoOpero"
                        etiqueta="Médico que Operó"
                        valor={formData.medicoOpero}
                        opciones={medicos}
                        onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                        onAgregarOpcion={agregarMedico("Médico que Operó")}
                        requerido={true}
                    />

                    <CampoSeleccionDinamico
                        nombre="medicoAyudo1"
                        etiqueta="Médico que Ayudó"
                        valor={formData.medicoAyudo1}
                        opciones={medicos}
                        onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                        onAgregarOpcion={agregarMedico("Médico que Ayudó 1")}
                        requerido={false}
                    />

                    <CampoSeleccionDinamico
                        nombre="medicoAyudo2"
                        etiqueta="Segundo Médico que Ayudó"
                        valor={formData.medicoAyudo2}
                        opciones={medicos}
                        onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                        onAgregarOpcion={agregarMedico("Segundo Médico que Ayudó")}
                        requerido={false}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-md text-black"
                        />
                    </div>
                </div>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md"
                >
                    Guardar Cirugía
                </button>
            </div>
        </form>
    );
};

export default FormularioCamposCirugia;