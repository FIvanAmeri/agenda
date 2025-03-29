import React, { useRef } from "react";

interface FileUploadProps {
  onExcelUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPdfUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onExcelUpload, onPdfUpload }) => {
  const excelFileInput = useRef<HTMLInputElement>(null);
  const pdfFileInput = useRef<HTMLInputElement>(null);

  const handleExcelClick = () => {
    excelFileInput.current?.click();
  };


  const handlePdfClick = () => {
    pdfFileInput.current?.click();
  };

  return (
    <div className="absolute top-6 right-4 sm:top-6 sm:right-6">
      <button
        onClick={handleExcelClick}
        className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600"
      >
        Cargar Excel
      </button>
      <input
        ref={excelFileInput}
        type="file"
        accept=".xlsx,.xls"
        onChange={onExcelUpload}
        className="hidden"
      />

      <button
        onClick={handlePdfClick}
        className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600"
      >
        Cargar PDF
      </button>

      <input
        ref={pdfFileInput}
        type="file"
        accept=".pdf"
        onChange={onPdfUpload}
        className="hidden"
      />
    </div>
  );
};

export default FileUpload;
