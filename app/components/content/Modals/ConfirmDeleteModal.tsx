"use client";

import React from "react";

interface Props {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
}

export const ConfirmDeleteModal: React.FC<Props> = ({ show, onClose, onConfirm }) => {
    if (!show) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-110 flex justify-center items-center p-4" onClick={onClose}>
            <div className="w-full max-w-md p-6 rounded-lg shadow-2xl text-white border-2 bg-[#0a1d25] border-cyan-600" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <h3 className="text-xl font-bold mb-4">¿Eliminar Paciente?</h3>
                <p className="text-gray-300 mb-6">Esta acción no se puede deshacer. El turno será borrado permanentemente de la agenda.</p>
                <div className="flex justify-end gap-3">
                    <button onClick={onClose} className="px-4 py-2 rounded-md font-semibold bg-gray-600 hover:bg-gray-700 transition duration-200 cursor-pointer">Cancelar</button>
                    <button onClick={onConfirm} className="px-4 py-2 rounded-md font-semibold bg-red-600 hover:bg-red-700 transition duration-200 cursor-pointer">Eliminar</button>
                </div>
            </div>
        </div>
    );
};