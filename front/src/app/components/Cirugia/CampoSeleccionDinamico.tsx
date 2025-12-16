import React from "react";
import { PropsCampoSeleccionDinamico } from "../../components/interfaz/interfaz";
import { FaPlus } from "react-icons/fa";

export const CampoSeleccionDinamico: React.FC<PropsCampoSeleccionDinamico> = ({
    nombre,
    etiqueta,
    valor,
    opciones,
    onChange,
    onAgregarOpcion,
    requerido,
    deshabilitado = false
}) => {
    return (
        <div className="relative">
            <label htmlFor={nombre} className="block text-sm font-medium text-gray-300 mb-1">{etiqueta}</label>
            <div className="flex items-center space-x-2"> 
                
                <div className="flex-1 overflow-hidden"> 
                    <select
                        id={nombre}
                        name={nombre}
                        value={valor}
                        onChange={onChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                        required={requerido}
                        className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500 appearance-none"
                        disabled={deshabilitado}
                    >
                        <option value="" disabled>Seleccione un {etiqueta.toLowerCase()}</option>
                        {opciones.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
                
                <button
                    type="button"
                    onClick={onAgregarOpcion}
                    title={`Agregar nuevo ${etiqueta.toLowerCase()}`}
                    className="p-2 bg-[#0c4a34] text-white rounded-md hover:bg-[#1f5666] transition duration-200 flex-shrink-0"
                    disabled={deshabilitado}
                >
                    <FaPlus className="text-lg" />
                </button>
            </div>
        </div>
    );
};