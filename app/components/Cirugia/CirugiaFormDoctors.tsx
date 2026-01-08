"use client";

import React from "react";
import { DatosFormularioCirugia, ListaDinamica } from "../../components/interfaz/interfaz";
import { CampoSeleccionDinamico } from "./CampoSeleccionDinamico";

interface Props {
    formData: DatosFormularioCirugia;
    medicos: string[];
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    abrirModalAgregar: (tipoColeccion: ListaDinamica, etiqueta: string) => () => void;
}

export const CirugiaFormDoctors: React.FC<Props> = ({
    formData,
    medicos,
    handleInputChange,
    abrirModalAgregar
}) => {
    return (
        <fieldset className="p-4 border border-cyan-800/30 rounded-lg space-y-4">
            <legend className="text-sm font-semibold text-cyan-400 px-2">Médicos Participantes</legend>
            <div className="grid grid-cols-1 gap-4">
                <CampoSeleccionDinamico
                    nombre="medicoOpero"
                    etiqueta="Médico que Operó"
                    valor={formData.medicoOpero}
                    opciones={medicos}
                    onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                    onAgregarOpcion={abrirModalAgregar("medicos", "Médico que Operó")}
                    requerido={true}
                />

                <CampoSeleccionDinamico
                    nombre="medicoAyudo1"
                    etiqueta="Médico Ayudante 1"
                    valor={formData.medicoAyudo1}
                    opciones={medicos}
                    onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                    onAgregarOpcion={abrirModalAgregar("medicos", "Médico Ayudante 1")}
                    requerido={false}
                />

                <CampoSeleccionDinamico
                    nombre="medicoAyudo2"
                    etiqueta="Médico Ayudante 2"
                    valor={formData.medicoAyudo2}
                    opciones={medicos}
                    onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                    onAgregarOpcion={abrirModalAgregar("medicos", "Médico Ayudante 2")}
                    requerido={false}
                />
            </div>
        </fieldset>
    );
};