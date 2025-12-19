"use client";

import React from "react";
import { Cirugia } from "../../components/interfaz/interfaz";

interface CirugiaDetailModalProps {
    cirugia: Cirugia;
    onClose: () => void;
    onSubmit: (id: number, payload: Partial<Cirugia>) => Promise<void>;
    medicosOpciones: string[];
    tiposCirugiaOpciones: string[];
    obrasSocialesOpciones: string[];
    showHonorarios: boolean;
}

export const CirugiaDetailModal: React.FC<CirugiaDetailModalProps> = ({
    cirugia,
    onClose,
    onSubmit,
    medicosOpciones,
    tiposCirugiaOpciones,
    obrasSocialesOpciones,
    showHonorarios
}) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-[#0F2A35] border border-cyan-900/50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-white">Editar Cirugía</h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-white text-2xl">&times;</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CirugiaDetailModal;