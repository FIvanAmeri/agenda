import React from 'react';
import { generarHoras } from '../utils/dateTimeHelpers';

interface PatientFormFieldsProps {
  formData: {
    dia: string;
    hora: string;
    paciente: string;
    practicas: string;
    obraSocial: string;
    institucion: string;
    estudioUrgoginecologico: boolean;
  };
  obrasSociales: string[];
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCheckboxChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PatientFormFields: React.FC<PatientFormFieldsProps> = ({
  formData,
  obrasSociales,
  onInputChange,
  onCheckboxChange
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Fecha</label>
          <input
            type="date"
            name="dia"
            value={formData.dia}
            onChange={onInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Hora</label>
          <select
            name="hora"
            value={formData.hora}
            onChange={onInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>Selecciona una hora</option>
            {generarHoras().map((horaOption, index) => (
              <option key={index} value={horaOption}>{horaOption}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Nombre del Paciente</label>
          <input
            type="text"
            name="paciente"
            value={formData.paciente}
            onChange={onInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Prácticas</label>
          <input
            type="text"
            name="practicas"
            value={formData.practicas}
            onChange={onInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="estudioUrgoginecologico"
            checked={formData.estudioUrgoginecologico}
            onChange={onCheckboxChange}
            className="h-4 w-4"
          />
          <label className="text-sm text-gray-200">Estudio Uroginecológico</label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Obra Social</label>
          <select
            name="obraSocial"
            value={formData.obraSocial}
            onChange={onInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {obrasSociales.map((option, index) => (
              <option key={index} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-200 mb-1">Institución</label>
          <input
            type="text"
            name="institucion"
            value={formData.institucion}
            onChange={onInputChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};