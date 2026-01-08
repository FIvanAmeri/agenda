"use client";

import React from "react";
import { FaPlus } from "react-icons/fa";
import { PropsCampoSeleccionDinamico } from "../../components/interfaz/interfaz";

export const CampoSeleccionDinamico: React.FC<PropsCampoSeleccionDinamico> = ({
    nombre,
    etiqueta,
    valor,
    opciones = [],
    onChange,
    onAgregarOpcion,
    requerido,
    deshabilitado = false
}) => {
    const opcionesUnicas = Array.from(new Set(opciones)).filter(opc => opc && opc.trim() !== "");

    return (
        <div className="flex flex-col w-full">
            <label className="block text-xs font-medium text-gray-300 mb-1">
                {etiqueta} {requerido && <span className="text-red-500">*</span>}
            </label>
            <div className="flex space-x-2">
                <select
                    name={nombre}
                    value={valor}
                    onChange={onChange}
                    required={requerido}
                    disabled={deshabilitado}
                    className="flex-1 p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white text-sm focus:ring-cyan-500 focus:border-cyan-500 disabled:opacity-50 appearance-none cursor-pointer"
                >
                    <option value="" className="bg-[#0F2A35]">Seleccione una opción</option>
                    {opcionesUnicas.map((opcion, index) => (
                        <option key={`${opcion}-${index}`} value={opcion} className="bg-[#0F2A35]">
                            {opcion}
                        </option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={onAgregarOpcion}
                    title={`Agregar ${etiqueta}`}
                    className="p-2 bg-cyan-700 text-white rounded-md hover:bg-cyan-600 transition flex-shrink-0 flex items-center justify-center min-w-[38px]"
                >
                    <FaPlus className="text-sm" />
                </button>
            </div>
        </div>
    );
};