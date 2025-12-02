"use client";

import React from 'react';
import { Cirugia } from '../interfaz/interfaz';
import { Stethoscope, DollarSign, X } from 'lucide-react';

interface CirugiaDetailModalProps {
    cirugia: Cirugia;
    onClose: () => void;
    showHonorarios: boolean;
}

const CirugiaDetailModal: React.FC<CirugiaDetailModalProps> = ({ cirugia, onClose, showHonorarios }) => {
    
    const formatHonorarios = (amount: number) => {
        return new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(amount);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose}>
            <div 
                className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-lg transform transition-all duration-300 scale-100"
                onClick={e => e.stopPropagation()}
            >
                <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h2 className="text-2xl font-bold text-cyan-800 flex items-center">
                        <Stethoscope className="w-6 h-6 mr-2 text-cyan-600" />
                        Detalle de Cirugía
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800 transition">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="space-y-3 text-gray-700">
                    <p><strong>Paciente:</strong> <span className="font-semibold">{cirugia.paciente}</span></p>
                    <p><strong>Fecha:</strong> {new Date(cirugia.fecha).toLocaleDateString('es-AR', { dateStyle: 'long' })}</p>
                    <p><strong>Tipo de Cirugía:</strong> <span className="font-semibold text-teal-600">{cirugia.tipoCirugia}</span></p>
                    <p><strong>Médico Principal:</strong> {cirugia.medicoOpero}</p>
                    
                    {(cirugia.medicoAyudo1 || cirugia.medicoAyudo2) && (
                        <div className="pt-2 border-t">
                            <p className="font-semibold text-cyan-700 mb-1">Equipo Asistente:</p>
                            <ul className="list-disc list-inside ml-2 text-sm">
                                {cirugia.medicoAyudo1 && <li>Ayudante 1: {cirugia.medicoAyudo1}</li>}
                                {cirugia.medicoAyudo2 && <li>Ayudante 2: {cirugia.medicoAyudo2}</li>}
                            </ul>
                        </div>
                    )}
                    
                    {showHonorarios && (
                        <div className="flex items-center pt-2 border-t">
                            <DollarSign className="w-5 h-5 mr-2 text-green-600" />
                            <p className="font-bold text-lg">Honorarios: <span className="text-green-700">{formatHonorarios(cirugia.honorarios)}</span></p>
                        </div>
                    )}

                    {cirugia.descripcion && (
                        <div className="pt-2 border-t">
                            <p className="font-semibold text-cyan-700">Notas/Descripción:</p>
                            <div className="bg-gray-50 p-3 rounded-lg text-sm italic whitespace-pre-wrap border border-gray-200">
                                {cirugia.descripcion}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end">
                    <button
                        onClick={onClose}
                        className="bg-cyan-700 hover:bg-cyan-800 text-white font-semibold py-2 px-4 rounded-lg transition duration-200 shadow-md"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CirugiaDetailModal;