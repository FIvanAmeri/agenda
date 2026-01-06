import React from "react";
import { Cirugia } from "../../components/interfaz/interfaz";
import { FormSelect } from "./FormSelect";

interface DoctorsSectionProps {
    formData: Partial<Cirugia>;
    medicosOpciones: string[];
    handleInputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const DoctorsSection: React.FC<DoctorsSectionProps> = ({
    formData,
    medicosOpciones,
    handleInputChange
}) => (
    <fieldset className="p-4 border border-[#1f3b47] rounded-lg space-y-4">
        <legend className="text-lg font-semibold text-cyan-400 px-2">Médicos Participantes</legend>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormSelect label="Médico que Operó" name="medicoOpero" value={formData.medicoOpero as string} options={medicosOpciones} onChange={handleInputChange} required />
            <FormSelect label="Médico Ayudante 1" name="medicoAyudo1" value={formData.medicoAyudo1 as string} options={medicosOpciones} onChange={handleInputChange} />
            <FormSelect label="Médico Ayudante 2" name="medicoAyudo2" value={formData.medicoAyudo2 as string} options={medicosOpciones} onChange={handleInputChange} />
        </div>
    </fieldset>
);