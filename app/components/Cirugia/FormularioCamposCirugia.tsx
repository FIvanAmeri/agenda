"use client";

import React, { useState, useCallback, useMemo } from "react";
import { PropsFormularioCirugia, ListaDinamica, Patient } from "../../components/interfaz/interfaz";
import { useFormularioCirugia } from "../../hooks/Cirugia/useFormularioCirugia";
import { FaTimes } from "react-icons/fa";
import { ModalAgregarOpcion } from "./ModalAgregarOpcion";
import { CirugiaFormGeneral } from "./CirugiaFormGeneral";
import { CirugiaFormDoctors } from "./CirugiaFormDoctors";
import { CirugiaFormFinance } from "./CirugiaFormFinance";

interface PropsExtendidasCirugia extends PropsFormularioCirugia {
    existingPatients?: Patient[];
}

export const FormularioCamposCirugia: React.FC<PropsExtendidasCirugia> = ({ 
    user, 
    onAdded, 
    onClose, 
    existingPatients = [] 
}) => {
    // Usamos el hook con el nombre corregido
    const {
        formData,
        medicos,
        tiposCirugia,
        obrasSociales,
        error,
        handleInputChange,
        handleAddOption,
        handleSubmit
    } = useFormularioCirugia({ user, onAdded, onClose });

    const [modalAbierto, setModalAbierto] = useState(false);
    const [etiquetaModal, setEtiquetaModal] = useState("");
    const [tipoColeccionModal, setTipoColeccionModal] = useState<ListaDinamica>("medicos");
    const [showSuggestions, setShowSuggestions] = useState(false);


    const suggestions = useMemo(() => {
        const term = formData.paciente.toLowerCase().trim();
        if (term.length < 2 || !existingPatients.length) return [];
        const uniqueNames = Array.from(new Set(existingPatients.map(p => p.paciente)));
        return uniqueNames
            .filter(name => name.toLowerCase().includes(term))
            .slice(0, 5);
    }, [formData.paciente, existingPatients]);

    const abrirModalAgregar = useCallback((tipoColeccion: ListaDinamica, etiqueta: string) => () => {
        setTipoColeccionModal(tipoColeccion);
        setEtiquetaModal(etiqueta);
        setModalAbierto(true);
    }, []);

    const cerrarModalAgregar = () => {
        setModalAbierto(false);
        setEtiquetaModal("");
    };

    const guardarNuevaOpcion = (nuevoValor: string) => {
        handleAddOption(tipoColeccionModal, nuevoValor);
        cerrarModalAgregar();
    };

    const handleSelectSuggestion = (name: string) => {
        const fakeEvent = {
            target: { name: "paciente", value: name }
        } as unknown as React.ChangeEvent<HTMLInputElement>;
        handleInputChange(fakeEvent);
        setShowSuggestions(false);
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden">
            <div className="bg-[#0F2A35] rounded-xl shadow-2xl w-full max-w-sm md:max-w-xl lg:max-w-2xl max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 md:ml-64 border border-cyan-800/50">
                
                {modalAbierto && (
                    <ModalAgregarOpcion 
                        etiqueta={etiquetaModal} 
                        onClose={cerrarModalAgregar} 
                        onSave={guardarNuevaOpcion} 
                    />
                )}
                
                <div className="sticky top-0 bg-[#1a4553] p-4 flex justify-between items-center text-white flex-shrink-0 border-b border-cyan-800/50">
                    <h2 className="text-xl font-bold">Nueva Cirugía</h2>
                    <button onClick={onClose} className="text-white hover:text-red-400 transition p-1 rounded-full hover:bg-black hover:bg-opacity-20">
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="p-3 bg-red-700 text-white rounded-md text-sm">
                                Error: {error}
                            </div>
                        )}

                        <CirugiaFormGeneral 
                            formData={formData}
                            tiposCirugia={tiposCirugia}
                            obrasSociales={obrasSociales}
                            suggestions={suggestions}
                            showSuggestions={showSuggestions}
                            handleInputChange={handleInputChange}
                            handleSelectSuggestion={handleSelectSuggestion}
                            setShowSuggestions={setShowSuggestions}
                            abrirModalAgregar={abrirModalAgregar}
                        />

                        <CirugiaFormDoctors 
                            formData={formData}
                            medicos={medicos}
                            handleInputChange={handleInputChange as unknown as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                            abrirModalAgregar={abrirModalAgregar}
                        />

                        <CirugiaFormFinance 
                            formData={formData}
                            handleInputChange={handleInputChange as unknown as (e: React.ChangeEvent<HTMLInputElement>) => void}
                        />

                        <div className="flex justify-end space-x-3 pt-4 border-t border-cyan-800/50">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-[#1a4553] transition duration-200 text-sm"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-emerald-700 text-white font-semibold rounded-md hover:bg-emerald-600 transition duration-200 text-sm"
                            >
                                Guardar Cirugía
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};