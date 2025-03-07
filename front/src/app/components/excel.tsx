import React, { useState } from "react";
import * as XLSX from "xlsx";

interface Patient {
  paciente: string;
  practicas: string;
  obraSocial: string;
  dia: string;
  institucion: string;
}

interface ExcelProps {
  onAddPatients: (newPatients: Patient[]) => void;
}

const ExcelUpload = ({ onAddPatients }: ExcelProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const savePatientsToBackend = async (patients: Patient[]) => {
    try {
      const response = await fetch("http://localhost:3001/api/paciente", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patients),
      });

      if (!response.ok) {
        throw new Error("No se pudieron guardar los pacientes.");
      }

      console.log("Pacientes guardados correctamente.");
    } catch (error) {
      console.error("Error al guardar pacientes:", error);
      setError("Hubo un error al guardar los pacientes.");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleFileUpload = () => {
    if (!file) {
      setError("Por favor, selecciona un archivo Excel.");
      return;
    }
  
    const reader = new FileReader();
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result;
      if (arrayBuffer) {
        const workbook = XLSX.read(new Uint8Array(arrayBuffer as ArrayBuffer), { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
  
        const newPatients = (data as any[]).map((row) => ({
          paciente: row.paciente,
          practicas: row.practicas,
          obraSocial: row.obraSocial,
          dia: row.dia,
          institucion: row.institucion,
        }));
  
        console.log('Pacientes a enviar al backend:', newPatients);
        onAddPatients(newPatients);
        savePatientsToBackend(newPatients);
      }
    };
  
    reader.readAsArrayBuffer(file);
  };
  

  return (
    <div className="excel-upload-container">
      <input
        type="file"
        accept=".xlsx, .xls, .csv"
        onChange={handleFileChange}
        className="file-input"
      />
      <button onClick={handleFileUpload} className="upload-button">
        Cargar Excel
      </button>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default ExcelUpload;
