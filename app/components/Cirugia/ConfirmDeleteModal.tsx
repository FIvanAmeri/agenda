"use client";

import React from "react";

interface ConfirmDeleteModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    patientName: string
    cirugiaId: number
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({ isOpen, onClose, onConfirm, patientName, cirugiaId }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm transition-opacity duration-300">
            <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md mx-4 p-6 border-t-4 border-red-500 transform scale-100 transition-transform duration-300">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-red-400">Confirmación de Eliminación</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-white transition duration-150"
                        aria-label="Cerrar modal"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>

                <div className="mb-6">
                    <p className="text-gray-300">
                        ¿Estás seguro de que quieres <strong className="text-red-400">eliminar</strong> la cirugía <span className="font-mono text-sm bg-gray-700/50 p-0.5 rounded text-red-300"></span> del paciente <strong className="text-white">{patientName}</strong>?
                    </p>
                    <p className="mt-2 text-sm text-yellow-400 font-medium">
                        Esta acción es <strong className="uppercase">irreversible</strong>.
                    </p>
                </div>

                <div className="flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-150 font-semibold shadow-md"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition duration-150 font-semibold shadow-md"
                    >
                        Sí, Eliminar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;