"use client";

import React from "react";
import { DatosFormularioCirugia, ListaDinamica } from "../../components/interfaz/interfaz";
import { CampoSeleccionDinamico } from "./CampoSeleccionDinamico";

interface Props {
    formData: DatosFormularioCirugia;
    tiposCirugia: string[];
    obrasSociales: string[];
    suggestions: string[];
    showSuggestions: boolean;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleSelectSuggestion: (name: string) => void;
    setShowSuggestions: (show: boolean) => void;
    abrirModalAgregar: (tipoColeccion: ListaDinamica, etiqueta: string) => () => void;
}

export const CirugiaFormGeneral: React.FC<Props> = ({
    formData,
    tiposCirugia,
    obrasSociales,
    suggestions,
    showSuggestions,
    handleInputChange,
    handleSelectSuggestion,
    setShowSuggestions,
    abrirModalAgregar
}) => {
    return (
        <div className="space-y-4">
            <h3 className="text-md font-semibold text-cyan-400">Datos Generales</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Fecha de Cirugía</label>
                    <input
                        type="date"
                        name="fecha"
                        value={formData.fecha}
                        onChange={handleInputChange}
                        required
                        className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white text-sm focus:ring-cyan-500 focus:border-cyan-500"
                    />
                </div>

                <div className="relative">
                    <label className="block text-xs font-medium text-gray-300 mb-1">Nombre del Paciente</label>
                    <input
                        type="text"
                        name="paciente"
                        value={formData.paciente}
                        onChange={(e) => {
                            handleInputChange(e);
                            setShowSuggestions(true);
                        }}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        required
                        autoComplete="off"
                        className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white text-sm focus:ring-cyan-500 focus:border-cyan-500"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute z-9999 w-full mt-1 bg-[#1a4553] border border-cyan-800/50 rounded-md shadow-lg max-h-40 overflow-auto">
                            {suggestions.map((name, index) => (
                                <li
                                    key={index}
                                    onClick={() => handleSelectSuggestion(name)}
                                    className="px-4 py-2 text-sm text-white hover:bg-cyan-900 cursor-pointer border-b border-cyan-800/20 last:border-0"
                                >
                                    {name}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Fecha de Nacimiento</label>
                    <input
                        type="date"
                        name="fechaNacimientoPaciente"
                        value={formData.fechaNacimientoPaciente}
                        onChange={handleInputChange}
                        className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white text-sm focus:ring-cyan-500 focus:border-cyan-500"
                    />
                </div>

                <div className="md:col-span-2">
                    <CampoSeleccionDinamico
                        nombre="tipoCirugia"
                        etiqueta="Tipo de Cirugía"
                        valor={formData.tipoCirugia}
                        opciones={tiposCirugia}
                        onChange={handleInputChange}
                        onAgregarOpcion={abrirModalAgregar("tiposCirugia", "Tipo de Cirugía")}
                        requerido={true}
                    />
                </div>

                <div className="md:col-span-2">
                    <CampoSeleccionDinamico
                        nombre="obraSocial"
                        etiqueta="Obra Social"
                        valor={formData.obraSocial}
                        opciones={obrasSociales}
                        onChange={handleInputChange}
                        onAgregarOpcion={abrirModalAgregar("obrasSociales", "Obra Social")}
                        requerido={false}
                    />
                </div>

                <div className="col-span-full">
                    <label className="block text-xs font-medium text-gray-300 mb-1">Descripción</label>
                    <textarea
                        name="descripcion"
                        value={formData.descripcion}
                        onChange={handleInputChange}
                        rows={2}
                        className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white text-sm focus:ring-cyan-500 focus:border-cyan-500"
                    />
                </div>
            </div>
        </div>
    );
};