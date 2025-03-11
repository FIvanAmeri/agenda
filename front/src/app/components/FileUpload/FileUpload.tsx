import React from "react";

interface FileUploadProps {
  onExcelUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPdfUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onExcelUpload, onPdfUpload }) => {
  return (
    <div className="absolute top-6 right-4 sm:top-6 sm:right-6">
      <button
        onClick={() => document.getElementById("fileInput")?.click()}
        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Excel
      </button>
      <input
        id="fileInput"
        type="file"
        accept=".xlsx,.xls"
        onChange={onExcelUpload}
        className="hidden"
      />

      <button
        onClick={() => document.getElementById("pdfInput")?.click()}
        className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        PDF
      </button>

      <input
        id="pdfInput"
        type="file"
        accept=".pdf"
        onChange={onPdfUpload}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;
