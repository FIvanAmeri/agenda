"use client";

import React, { useState } from "react";
import { FaTimes, FaPlus } from "react-icons/fa";

interface PropsModalAgregarOpcion {
    etiqueta: string;
    onClose: () => void;
    onSave: (nuevoValor: string) => void;
}

export const ModalAgregarOpcion: React.FC<PropsModalAgregarOpcion> = ({ etiqueta, onClose, onSave }) => {
    const [nuevoValor, setNuevoValor] = useState<string>("");
    const [error, setError] = useState<string>("");

    const handleSave = (): void => {
        const valorLimpio: string = nuevoValor.trim();
        if (valorLimpio === "") {
            setError("El valor no puede estar vacío.");
            return;
        }
        setError("");
        onSave(valorLimpio);
        setNuevoValor("");
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        } else if (e.key === "Escape") {
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
            <div 
                className="bg-[#1f3b47] rounded-xl shadow-2xl w-full max-w-sm mx-auto transform scale-100 border border-cyan-900/50 overflow-hidden"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
                <div className="bg-linear-to-r from-[#004d40] to-[#1a4553] p-4 flex justify-between items-center text-white">
                    <h3 className="text-lg font-semibold">Agregar {etiqueta}</h3>
                    <button 
                        onClick={onClose} 
                        className="text-gray-200 hover:text-red-400 transition p-1 rounded-full hover:bg-white/10"
                        title="Cerrar"
                    >
                        <FaTimes />
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    <div className="space-y-1">
                        <input
                            type="text"
                            value={nuevoValor}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                setNuevoValor(e.target.value);
                                if (error) setError("");
                            }}
                            onKeyDown={handleKeyDown}
                            placeholder={`Escriba el nombre del ${etiqueta.toLowerCase()}`}
                            className="w-full p-3 bg-[#0F2A35] border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-cyan-500 focus:border-transparent outline-none transition-all"
                            autoFocus
                        />
                        {error && (
                            <p className="text-red-400 text-xs mt-1 ml-1 animate-pulse">
                                {error}
                            </p>
                        )}
                    </div>
                    <div className="flex justify-end items-center space-x-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-300 text-sm hover:text-white transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="px-5 py-2 bg-emerald-700 text-white font-semibold rounded-lg hover:bg-emerald-600 active:scale-95 transition-all flex items-center space-x-2 text-sm shadow-lg shadow-emerald-900/20"
                        >
                            <FaPlus className="text-xs" />
                            <span>Confirmar</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};