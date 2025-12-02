import React from "react";
import { PropsCampoSeleccionDinamico } from "../../components/interfaz/tipos-cirugia";

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
        <div>
            <label htmlFor={nombre as string} className="block text-sm font-medium text-gray-200 mb-1">{etiqueta}</label>
            <div className="flex space-x-2">
                <select
                    id={nombre as string}
                    name={nombre as string}
                    value={valor}
                    onChange={onChange}
                    required={requerido}
                    className="flex-1 p-2 border border-gray-300 rounded-md text-black"
                    disabled={deshabilitado}
                >
                    <option value="" disabled>Selecciona {etiqueta.toLowerCase().includes('médico') ? 'el médico' : 'el tipo'}</option>
                    {opciones.map(option => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
                <button
                    type="button"
                    onClick={onAgregarOpcion}
                    className="bg-gray-400 text-white px-3 py-2 rounded-md"
                    disabled={deshabilitado}
                >
                    +
                </button>
            </div>
        </div>
    );
};