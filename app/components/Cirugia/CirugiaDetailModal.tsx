"use client";

import React, { useState } from "react";
import { 
    Cirugia, 
    Patient, 
    ListaDinamica, 
    DatosFormularioCirugia 
} from "../../components/interfaz/interfaz";
import { FaTimes } from "react-icons/fa";
import { CirugiaFormGeneral } from "./CirugiaFormGeneral";
import { CirugiaFormDoctors } from "./CirugiaFormDoctors";
import { CirugiaFormFinance } from "./CirugiaFormFinance";
import { ModalAgregarOpcion } from "./ModalAgregarOpcion";
import { useCirugiaDetailLogic } from "../../hooks/Cirugia/useCirugiaDetailLogic";

interface CirugiaDetailModalProps {
    cirugia: Cirugia;
    onClose: () => void;
    onSubmit: (id: number, payload: Partial<Cirugia>) => Promise<void>;
    medicosOpciones: string[];
    tiposCirugiaOpciones: string[];
    obrasSocialesOpciones: string[];
    showHonorarios: boolean;
    existingPatients?: Patient[];
}

export const CirugiaDetailModal: React.FC<CirugiaDetailModalProps> = ({
    cirugia,
    onClose,
    onSubmit,
    medicosOpciones: medApi,
    tiposCirugiaOpciones: tipApi,
    obrasSocialesOpciones: obrApi,
    showHonorarios,
    existingPatients = []
}) => {
    
    const { 
        formData, 
        handleInputChange, 
        handleSubmit, 
        loading, 
        isDirty, 
        setFormData 
    } = useCirugiaDetailLogic({ cirugia, onSubmit });
    
    const [modalAbierto, setModalAbierto] = useState(false);
    const [etiquetaModal, setEtiquetaModal] = useState("");
    const [tipoColeccionModal, setTipoColeccionModal] = useState<ListaDinamica>("medicos");

    const [listas, setListas] = useState({
        medicos: medApi,
        tiposCirugia: tipApi,
        obrasSociales: obrApi
    });

    const abrirModalAgregar = (tipo: ListaDinamica, etiqueta: string) => () => {
        setTipoColeccionModal(tipo);
        setEtiquetaModal(etiqueta);
        setModalAbierto(true);
    };

    const guardarNuevaOpcion = (nuevoValor: string) => {
        const val = nuevoValor.trim().toUpperCase();
        setListas(prev => ({ ...prev, [tipoColeccionModal]: [...prev[tipoColeccionModal], val] }));
        
        const fieldMap: Record<ListaDinamica, keyof DatosFormularioCirugia> = {
            medicos: "medicoOpero",
            tiposCirugia: "tipoCirugia",
            obrasSociales: "obraSocial"
        };
        
        setFormData(prev => ({ ...prev, [fieldMap[tipoColeccionModal]]: val }));
        setModalAbierto(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-hidden">
            <div className="bg-[#0F2A35] border border-cyan-900/50 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
                {modalAbierto && (
                    <ModalAgregarOpcion
                        etiqueta={etiquetaModal}
                        onClose={() => setModalAbierto(false)}
                        onSave={guardarNuevaOpcion}
                    />
                )}

                <div className="p-6 bg-[#1a4553] flex justify-between items-center border-b border-cyan-800/50 shrink-0">
                    <h2 className="text-2xl font-bold text-white">Editar Cirugía</h2>
                    <button onClick={onClose} className="text-white hover:text-red-400 transition" type="button">
                        <FaTimes className="text-2xl" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <CirugiaFormGeneral
                            formData={formData}
                            tiposCirugia={listas.tiposCirugia}
                            obrasSociales={listas.obrasSociales}
                            suggestions={[]}
                            showSuggestions={false}
                            handleInputChange={handleInputChange}
                            handleSelectSuggestion={(val) => setFormData(p => ({ ...p, paciente: val }))}
                            setShowSuggestions={() => {}}
                            abrirModalAgregar={abrirModalAgregar}
                        />

                        <CirugiaFormDoctors
                            formData={formData}
                            medicos={listas.medicos}
                            handleInputChange={handleInputChange}
                            abrirModalAgregar={abrirModalAgregar}
                        />

                        {showHonorarios && (
                            <CirugiaFormFinance
                                formData={formData}
                                handleInputChange={handleInputChange}
                            />
                        )}

                        <div className="flex justify-end space-x-3 pt-4 border-t border-cyan-800/50">
                            <button 
                                type="button" 
                                onClick={onClose} 
                                className="px-4 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-[#1a4553] transition text-sm"
                            >
                                Cancelar
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading || !isDirty}
                                className="px-4 py-2 bg-emerald-700 text-white font-semibold rounded-md hover:bg-emerald-600 transition text-sm disabled:opacity-50"
                            >
                                {loading ? "Guardando..." : "Guardar Cambios"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};