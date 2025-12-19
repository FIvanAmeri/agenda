import React from 'react';
import { generarHoras } from '../utilidades/dateTimeHelpers';
import { DatosFormularioPaciente } from './interfaz/tipos-paciente';
import { Patient } from "./interfaz/interfaz";

interface PatientFormFieldsProps {
    formData: DatosFormularioPaciente;
    obrasSociales: string[];
    onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    suggestions: Patient[];
    showSuggestions: boolean;
    onSelectPatient: (p: Patient) => void;
}

const PRACTICAS_OPTIONS = [
    "Consulta General",
    "Estudio Urodinámico",
    "Flujometría"
];

const INSTITUCION_OPTIONS = [
    "Alto Rosario",
    "ICR",
    "Sanatorio Parque",
];

export const PatientFormFields: React.FC<PatientFormFieldsProps> = ({
    formData,
    obrasSociales,
    onInputChange,
    onCheckboxChange,
    suggestions,
    showSuggestions,
    onSelectPatient
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-x-4 gap-y-3 overflow-visible">
            
            <div className="relative">
                <label className="block text-sm font-medium text-gray-300 mb-1">Nombre del Paciente</label>
                <input
                    type="text"
                    name="paciente"
                    value={formData.paciente}
                    onChange={onInputChange}
                    autoComplete="off"
                    required
                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
                />
                
                {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-full mt-1 bg-[#0d2a35] border-2 border-cyan-500 rounded-md shadow-2xl z-[9999] max-h-60 overflow-y-auto">
                        {suggestions.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => onSelectPatient(p)}
                                className="w-full text-left p-3 hover:bg-cyan-800 border-b border-cyan-900 last:border-0 cursor-pointer"
                            >
                                <div className="font-bold text-white text-sm">{p.paciente}</div>
                                <div className="text-[10px] text-cyan-400 flex justify-between">
                                    <span>{p.obraSocial}</span>
                                    <span>{p.fechaNacimiento || ""}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Fecha</label>
                <input
                    type="date"
                    name="dia"
                    value={formData.dia}
                    onChange={onInputChange}
                    required
                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Hora</label>
                <select
                    name="hora"
                    value={formData.hora}
                    onChange={onInputChange}
                    required
                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500 appearance-none"
                >
                    <option value="" disabled>Selecciona una hora</option>
                    {generarHoras().map((horaOption, index) => (
                        <option key={index} value={horaOption}>{horaOption}</option>
                    ))}
                </select>
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Nacimiento</label>
                <input
                    type="date"
                    name="fechaNacimiento"
                    value={formData.fechaNacimiento || ''}
                    onChange={onInputChange}
                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Obra Social</label>
                <select
                    name="obraSocial"
                    value={formData.obraSocial}
                    onChange={onInputChange}
                    required
                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500 appearance-none"
                >
                    <option value="" disabled>Escoja una obra social</option>
                    {obrasSociales.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Institución</label>
                <select
                    name="institucion"
                    value={formData.institucion}
                    onChange={onInputChange}
                    required
                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500 appearance-none"
                >
                    <option value="" disabled>Selecciona una institución</option>
                    {INSTITUCION_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>

            <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Prácticas</label>
                <select
                    name="practicas"
                    value={formData.practicas}
                    onChange={onInputChange}
                    required
                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500 appearance-none"
                >
                    <option value="" disabled>Escoja una opción</option>
                    {PRACTICAS_OPTIONS.map((option) => (
                        <option key={option} value={option}>{option}</option>
                    ))}
                </select>
            </div>
            
        </div>
    );
};