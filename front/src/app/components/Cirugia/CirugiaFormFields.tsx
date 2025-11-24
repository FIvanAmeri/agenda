"use client";

import React, { useState } from "react";
import { User } from "../interfaz/interfaz";
import { formatDate } from "../../utils/dateTimeHelpers";




export interface CirugiaFormFieldsProps {
    user: User;
    onAdded: () => void;
    onClose: () => void; 
}


interface CirugiaFormData {
    fecha: string;
    paciente: string;
    tipoCirugia: string;
    medicoOpero: string;
    medicoAyudo1: string;
    medicoAyudo2: string;
    honorarios: number;
    descripcion: string;
}


const CirugiaFormFields: React.FC<CirugiaFormFieldsProps> = ({ user, onAdded, onClose }) => {
    
    const [formData, setFormData] = useState<CirugiaFormData>({
        fecha: formatDate(new Date().toISOString()),
        paciente: '',
        tipoCirugia: '',
        medicoOpero: '',
        medicoAyudo1: '',
        medicoAyudo2: '',
        honorarios: 0,
        descripcion: '',
    });
    
    const [error, setError] = useState<string | null>(null);


    const [medicos, setMedicos] = useState<string[]>([]);
    const [tiposCirugia, setTiposCirugia] = useState<string[]>([]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: type === 'number' ? Number(value) : value 
        }));
    };
    

    const handleAddOption = (listName: 'medicos' | 'tiposCirugia', fieldLabel: string) => {
        const newOption = prompt(`Ingrese el nuevo valor para ${fieldLabel}:`);
        if (newOption && newOption.trim() !== "") {
            if (listName === 'medicos') {
                setMedicos(prev => (prev.includes(newOption) ? prev : [...prev, newOption]));
       
            } else if (listName === 'tiposCirugia') {
                setTiposCirugia(prev => (prev.includes(newOption) ? prev : [...prev, newOption]));
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const cirugiaPayload = {
            ...formData,
            userId: Number(user.id)
        };

        try {
            const response = await fetch('http://localhost:3001/api/cirugias', {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(cirugiaPayload),
            });

            if (!response.ok) {
                const text = await response.text();
                console.error("Error al agregar cirugía:", text);
                throw new Error('Error al crear la cirugía');
            }

     
            onAdded();
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Hubo un error al guardar la cirugía');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
         
                <div className="space-y-4">
                    
      
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Fecha</label>
                        <input
                            type="date"
                            name="fecha"
                            value={formData.fecha}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

             
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Nombre del Paciente</label>
                        <input
                            type="text"
                            name="paciente"
                            value={formData.paciente}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

        
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Tipo de Cirugía</label>
                        <div className="flex space-x-2">
                            <select
                                name="tipoCirugia"
                                value={formData.tipoCirugia}
                                onChange={handleInputChange}
                                required
                                className="flex-1 p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Selecciona el tipo</option>
                                {tiposCirugia.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <button 
                                type="button" 
                                onClick={() => handleAddOption('tiposCirugia', 'Tipo de Cirugía')}
                                className="bg-gray-400 text-white px-3 py-2 rounded-md hover:bg-gray-500"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    
             
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Honorarios</label>
                        <input
                            type="number"
                            name="honorarios"
                            value={formData.honorarios}
                            onChange={handleInputChange}
                            required
                            className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

          
                <div className="space-y-4">
         
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Médico que Operó</label>
                        <div className="flex space-x-2">
                            <select
                                name="medicoOpero"
                                value={formData.medicoOpero}
                                onChange={handleInputChange}
                                required
                                className="flex-1 p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>Selecciona el médico</option>
                                {medicos.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <button 
                                type="button" 
                                onClick={() => handleAddOption('medicos', 'Médico que Operó')}
                                className="bg-gray-400 text-white px-3 py-2 rounded-md hover:bg-gray-500"
                            >
                                +
                            </button>
                        </div>
                    </div>

             
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Médico que Ayudó</label>
                        <div className="flex space-x-2">
                            <select
                                name="medicoAyudo1"
                                value={formData.medicoAyudo1}
                                onChange={handleInputChange}
                                className="flex-1 p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecciona el médico</option>
                                {medicos.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <button 
                                type="button" 
                                onClick={() => handleAddOption('medicos', 'Médico que Ayudó 1')}
                                className="bg-gray-400 text-white px-3 py-2 rounded-md hover:bg-gray-500"
                            >
                                +
                            </button>
                        </div>
                    </div>

             
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Segundo Médico que Ayudó</label>
                        <div className="flex space-x-2">
                            <select
                                name="medicoAyudo2"
                                value={formData.medicoAyudo2}
                                onChange={handleInputChange}
                                className="flex-1 p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Selecciona el médico</option>
                                {medicos.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                            <button 
                                type="button" 
                                onClick={() => handleAddOption('medicos', 'Segundo Médico que Ayudó')}
                                className="bg-gray-400 text-white px-3 py-2 rounded-md hover:bg-gray-500"
                            >
                                +
                            </button>
                        </div>
                    </div>
                    
               
                    <div>
                        <label className="block text-sm font-medium text-gray-200 mb-1">Descripción</label>
                        <textarea
                            name="descripcion"
                            value={formData.descripcion}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>
            </div>
            
            <div className="mt-6 flex justify-end space-x-4">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
                >
                    Guardar Cirugía
                </button>
            </div>
        </form>
    );
};

export default CirugiaFormFields;