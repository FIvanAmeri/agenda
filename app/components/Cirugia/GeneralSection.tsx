import React from "react";
import { Cirugia } from "../../components/interfaz/interfaz";
import { FormInput } from "./FormInput";
import { FormSelect } from "./FormSelect";

interface GeneralSectionProps {
    formData: Partial<Cirugia>;
    tiposCirugiaOpciones: string[];
    obrasSocialesOpciones: string[];
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

export const GeneralSection: React.FC<GeneralSectionProps> = ({
    formData,
    tiposCirugiaOpciones,
    obrasSocialesOpciones,
    handleInputChange
}) => (
    <section className="space-y-4">
        <h3 className="text-lg font-semibold text-cyan-400">Datos Generales</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormInput label="Fecha de Cirugía" name="fecha" type="date" value={formData.fecha || ""} onChange={handleInputChange} required />
            <FormInput label="Nombre del Paciente" name="paciente" type="text" value={formData.paciente || ""} onChange={handleInputChange} required />
            <FormInput label="Fecha de Nacimiento" name="fechaNacimientoPaciente" type="date" value={formData.fechaNacimientoPaciente || ""} onChange={handleInputChange} />
            <div className="md:col-span-2">
                <FormSelect label="Tipo de Cirugía" name="tipoCirugia" value={formData.tipoCirugia as string} options={tiposCirugiaOpciones} onChange={handleInputChange} required />
            </div>
            <FormSelect label="Obra Social" name="obraSocial" value={formData.obraSocial as string} options={obrasSocialesOpciones} onChange={handleInputChange} />
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
            <textarea name="descripcion" value={formData.descripcion || ""} onChange={handleInputChange} rows={3} className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500" />
        </div>
    </section>
);