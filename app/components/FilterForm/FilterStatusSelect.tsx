"use client";

import React from "react";

interface FilterStatusSelectProps {
    value: string;
    onChange: (value: string) => void;
}

export const FilterStatusSelect: React.FC<FilterStatusSelectProps> = ({ value, onChange }) => {
    return (
        <div className="flex flex-col w-full">
            <label className="text-xs font-medium text-gray-400 mb-1">Estado Pago</label>
            <div className="relative">
                <select
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(e.target.value)}
                    className="p-2 border border-gray-600 bg-white rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner w-full h-10 appearance-none pr-8"
                >
                    <option value="" disabled hidden>Opción</option>
                    <option value="pagado">Pagado</option>
                    <option value="no pagado">No Pagado</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};