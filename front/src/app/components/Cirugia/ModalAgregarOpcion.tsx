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
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 backdrop-blur-sm">
            <div className="bg-[#1f3b47] rounded-xl shadow-2xl w-full max-w-sm mx-4 transform scale-100 border border-cyan-900/50">
                <div className="bg-gradient-to-r from-[#004d40] to-[#1a4553] p-4 flex justify-between items-center text-white rounded-t-xl">
                    <h3 className="text-lg font-semibold">Agregar {etiqueta}</h3>
                    <button onClick={onClose} className="text-gray-200 hover:text-red-400 transition p-1">
                        <FaTimes />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <input
                        type="text"
                        value={nuevoValor}
                        onChange={(e) => {
                            setNuevoValor(e.target.value);
                            if (error) setError("");
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder={`Nuevo ${etiqueta.toLowerCase()}`}
                        className="w-full p-3 bg-[#0F2A35] border border-gray-600 rounded-lg text-white focus:ring-cyan-500 focus:border-cyan-500"
                        autoFocus
                    />
                    {error && (
                        <div className="p-2 bg-red-700 text-white text-xs rounded-md">
                            {error}
                        </div>
                    )}
                    <div className="flex justify-end space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 text-sm hover:underline"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-5 py-2 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-600 transition flex items-center space-x-2 text-sm"
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