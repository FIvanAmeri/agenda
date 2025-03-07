
import React, { useState } from "react";
import * as XLSX from "xlsx";

interface Patient {
  paciente: string;
  concepto: string;
}

interface ExcelProps {
  onAddPatients: (newPatients: Patient[]) => void;
}

const ExcelUpload = ({ onAddPatients }: ExcelProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

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
      const binaryStr = e.target?.result;
      if (binaryStr) {
        const workbook = XLSX.read(binaryStr, { type: "binary" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(sheet);
        const newPatients = (data as any[]).map((row) => ({
          paciente: row.paciente,
          concepto: row.concepto,
        }));

        onAddPatients(newPatients);
      }
    };

    reader.readAsBinaryString(file);
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
