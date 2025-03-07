import React, { useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

const PdfReader = () => {
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar el archivo PDF
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setPdfFile(file);
      extractTextFromPdf(file);
    }
  };

  // Función para leer el contenido de un archivo PDF
  const extractTextFromPdf = (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const typedArray = new Uint8Array(reader.result as ArrayBuffer);
      try {
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        const numPages = pdf.numPages;
        let fullText = '';

        // Extraer texto de cada página
        for (let pageNum = 1; pageNum <= numPages; pageNum++) {
          const page = await pdf.getPage(pageNum);
          const textContent = await page.getTextContent();
          fullText += textContent.items.map((item: any) => item.str).join(' ') + '\n';
        }

        // Procesar el texto extraído
        processExtractedText(fullText);
      } catch (err) {
        setError('Error al leer el archivo PDF.');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Procesar el texto extraído del PDF y buscar nombres de pacientes, obra social, institución y estudio
  const processExtractedText = (text: string) => {
    try {
      // Definir las palabras clave que pueden indicar los campos a extraer
      const keywords = {
        name: ['nombre', 'paciente', 'concepto', 'nombre del paciente', 'paciente:', 'Nombre:', 'Paciente:', 'Concepto:'],
        insurance: ['obra social', 'obra:', 'seguro:', 'pami'],
        institution: ['institución', 'instituto', 'centro', 'hospital'],
        study: ['estudio', 'examen', 'procedimiento', 'diagnóstico']
      };

      const lines = text.split('\n');
      const patientData: any[] = [];

      let currentPatient: any = { name: '', insurance: '', institution: '', study: '' };

      lines.forEach((line) => {
        // Buscar nombre del paciente
        keywords.name.forEach((keyword) => {
          if (line.toLowerCase().includes(keyword)) {
            const parts = line.split(":");
            if (parts.length > 1) {
              currentPatient.name = parts[1].trim();
            }
          }
        });

        // Buscar obra social
        keywords.insurance.forEach((keyword) => {
          if (line.toLowerCase().includes(keyword)) {
            const parts = line.split(":");
            if (parts.length > 1) {
              currentPatient.insurance = parts[1].trim();
            }
          }
        });

        // Buscar institución
        keywords.institution.forEach((keyword) => {
          if (line.toLowerCase().includes(keyword)) {
            const parts = line.split(":");
            if (parts.length > 1) {
              currentPatient.institution = parts[1].trim();
            }
          }
        });

        // Buscar estudio
        keywords.study.forEach((keyword) => {
          if (line.toLowerCase().includes(keyword)) {
            const parts = line.split(":");
            if (parts.length > 1) {
              currentPatient.study = parts[1].trim();
            }
          }
        });

        // Si encontramos un paciente con la información completa, añadirlo a la lista
        if (currentPatient.name && currentPatient.insurance && currentPatient.institution && currentPatient.study) {
          patientData.push({ ...currentPatient });
          currentPatient = { name: '', insurance: '', institution: '', study: '' }; // Limpiar para el siguiente paciente
        }
      });

      // Actualizar el estado con los datos de los pacientes
      setPatients(patientData);
      setError(null); // Limpiar cualquier error si el procesamiento fue exitoso
    } catch (err) {
      setError('Error al procesar el texto extraído del PDF.');
    }
  };

  return (
    <div className="container">
      <h1 className="text-center text-2xl font-bold">Lectura de PDF</h1>
      <input
        type="file"
        accept="application/pdf"
        onChange={handleFileChange}
        className="my-4 p-2 border border-gray-300 rounded"
      />
      
      {error && <div className="text-red-500">{error}</div>}

      <div>
        <h2 className="text-xl font-semibold">Pacientes encontrados:</h2>
        <ul className="list-disc pl-5">
          {patients.length > 0 ? (
            patients.map((patient, index) => (
              <li key={index}>
                <p><strong>Nombre:</strong> {patient.name}</p>
                <p><strong>Obra Social:</strong> {patient.insurance}</p>
                <p><strong>Institución:</strong> {patient.institution}</p>
                <p><strong>Estudio:</strong> {patient.study}</p>
              </li>
            ))
          ) : (
            <li>No se encontraron pacientes.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default PdfReader;
