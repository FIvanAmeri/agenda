"use client";

import React, { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";

interface PropsModalAgregarOpcion {
    etiqueta: string;
    onClose: () => void;
    onSave: (nuevoValor: string) => void;
}

export const ModalAgregarOpcion: React.FC<PropsModalAgregarOpcion> = ({ etiqueta, onClose, onSave }) => {
    const [nuevoValor, setNuevoValor] = useState("");
    const [error, setError] = useState("");

    const handleSave = () => {
        if (nuevoValor.trim() === "") {
            setError("El valor no puede estar vacío.");
            return;
        }
        setError("");
        onSave(nuevoValor.trim());
        setNuevoValor("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSave();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 transition-opacity duration-300">
            <div className="bg-[#1f3b47] rounded-xl shadow-2xl w-full max-w-sm mx-4 sm:mx-0 transform scale-100 opacity-100 transition-transform duration-300 border border-[#0c4a34]">
                
                <div className="bg-gradient-to-r from-[#004d40] to-[#1a4553] p-4 flex justify-between items-center text-white rounded-t-xl">
                    <h3 className="text-xl font-semibold">Agregar Nuevo {etiqueta}</h3>
                    <button onClick={onClose} className="text-gray-200 hover:text-red-400 transition p-1 rounded-full hover:bg-black hover:bg-opacity-20">
                        <FaTimes className="text-lg" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    
                    <input
                        type="text"
                        value={nuevoValor}
                        onChange={(e) => {
                            setNuevoValor(e.target.value);
                            if (error) setError("");
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={`Ingrese el nuevo ${etiqueta.toLowerCase()}`}
                        className="w-full p-3 bg-[#0F2A35] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-cyan-500 focus:border-cyan-500 shadow-inner"
                        autoFocus
                    />
                    
                    {error && (
                        <div className="p-2 bg-red-700 text-white text-sm rounded-md">
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-3 border-t border-[#1a4553]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2 border border-gray-500 text-gray-300 rounded-lg hover:bg-[#1a4553] transition duration-200 text-sm font-medium"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-5 py-2 bg-[#0c4a34] text-white font-semibold rounded-lg hover:bg-[#1f5666] transition duration-200 flex items-center space-x-2 text-sm"
                        >
                            <FaPlus />
                            <span>Aceptar</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
};