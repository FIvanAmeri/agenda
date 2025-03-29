import React, { useState, useRef } from 'react';
import { useObrasSociales } from '../../hooks/useObrasSociales';
import Patient from "../interfaz/interfaz";

interface AddPatientMasivoModalProps {
  onClose: () => void;
  onAdd: (newPatients: Patient[]) => void;
}

const AddPatientMasivoModal: React.FC<AddPatientMasivoModalProps> = ({ onClose, onAdd }) => {
  const { obrasSociales } = useObrasSociales();
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleSubmit = async () => {
    if (!file) {
      setError("Debes seleccionar un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:3001/api/pacientes-masivos", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al cargar los pacientes.");
      }

      const result = await response.json();
      onAdd(result.pacientes);
      onClose();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Hubo un error");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-white text-center">Agregar Excel</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-200">Seleccionar Archivo</label>
          <div
            className="w-full mt-2 p-4 border-2 border-gray-300 border-dashed rounded-md text-black bg-white cursor-pointer"
            onClick={handleFileClick}
          >
            {file ? (
              <p>{file.name}</p>
            ) : (
              <p className="text-gray-500">Haz clic aquí para seleccionar el archivo.</p>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx, .csv"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <div className="flex justify-between mt-6 space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 w-full"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 w-full"
          >
            Carga masiva
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddPatientMasivoModal;
