"use client";

import React from "react";
import { DatosFormularioCirugia } from "../../components/interfaz/interfaz";

interface Props {
    formData: DatosFormularioCirugia;
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CirugiaFormFinance: React.FC<Props> = ({ formData, handleInputChange }) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <fieldset className="p-4 border border-cyan-800/30 rounded-lg space-y-4">
                <legend className="text-sm font-semibold text-cyan-400 px-2">Honorarios</legend>
                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Monto Total</label>
                    <input
                        type="number"
                        name="montoTotalHonorarios"
                        value={formData.montoTotalHonorarios}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white text-sm focus:ring-cyan-500 focus:border-cyan-500"
                    />
                </div>
            </fieldset>

            <fieldset className="p-4 border border-cyan-800/30 rounded-lg space-y-4">
                <legend className="text-sm font-semibold text-cyan-400 px-2">Presupuesto</legend>
                <div>
                    <label className="block text-xs font-medium text-gray-300 mb-1">Monto Total</label>
                    <input
                        type="number"
                        name="montoTotalPresupuesto"
                        value={formData.montoTotalPresupuesto}
                        onChange={handleInputChange}
                        min="0"
                        step="0.01"
                        className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white text-sm focus:ring-cyan-500 focus:border-cyan-500"
                    />
                </div>
            </fieldset>
        </div>
    );
};