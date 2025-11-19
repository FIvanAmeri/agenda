import React, { useState, useEffect, useCallback } from "react";
import { useObrasSociales } from "../../hooks/useObrasSociales";
import { Patient, User } from "../interfaz/interfaz";

interface EditPatientModalProps {
  user: User;
  selectedPatient: Patient;
  updatePatient: (updatedPatient: Patient) => void;
  setShowEditModal: (value: boolean) => void;
}

const EditPatientModal: React.FC<EditPatientModalProps> = ({
  user,
  selectedPatient,
  updatePatient,
  setShowEditModal,
}) => {
  const { obrasSociales } = useObrasSociales();

  const extractTime = (timeString: string): string => {
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) return timeString;
    const time = new Date(timeString);
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const generarHoras = (): string[] => {
    const horas: string[] = [];
    for (let h = 9; h <= 16; h++) {
      for (let m = 0; m < 60; m += 15) {
        horas.push(`${h.toString().padStart(2,"0")}:${m.toString().padStart(2,"0")}`);
      }
    }
    return horas;
  };

  const [hora, setHora] = useState<string>(extractTime(selectedPatient.hora));
  const [dia, setDia] = useState<string>(formatDate(selectedPatient.dia));
  const [paciente, setPaciente] = useState(selectedPatient.paciente);
  const [practicas, setPracticas] = useState(selectedPatient.practicas);
  const [obraSocial, setObraSocial] = useState(selectedPatient.obraSocial);
  const [institucion, setInstitucion] = useState(selectedPatient.institucion);
  const [error, setError] = useState<string | null>(null);
  const [estudioUrgoginecologico, setEstudioUrgoginecologico] = useState<boolean>(
    selectedPatient.practicas.includes("(U)")
  );

  const closeModal = useCallback(() => { setShowEditModal(false); }, [setShowEditModal]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => { if (event.key === 'Escape') closeModal(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeModal]);

  useEffect(() => {
    setHora(extractTime(selectedPatient.hora));
    setDia(formatDate(selectedPatient.dia));
    setPaciente(selectedPatient.paciente);
    setPracticas(selectedPatient.practicas);
    setObraSocial(selectedPatient.obraSocial);
    setInstitucion(selectedPatient.institucion);
    setEstudioUrgoginecologico(selectedPatient.practicas.includes("(U)"));
  }, [selectedPatient]);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setEstudioUrgoginecologico(isChecked);
    setPracticas(prev => isChecked ? (prev.includes("(U)") ? prev : `${prev} (U)`) : prev.replace(" (U)", ""));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedPatient: Patient = {
      ...selectedPatient,
      hora: `${dia}T${hora}:00`,
      dia,
      paciente,
      practicas,
      obraSocial,
      institucion,
      userId: Number(user.id)
    };

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://localhost:3001/api/paciente/${selectedPatient.id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedPatient),
      });

      if (!response.ok) throw new Error("Error al actualizar el paciente");

      const result = await response.json();
      updatePatient(result.paciente);
      alert("Paciente editado correctamente");
      closeModal();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hubo un error al actualizar");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 p-4" onClick={closeModal}>
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-lg shadow-lg w-full max-w-6xl mx-auto overflow-y-auto" style={{ maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white">Editar Paciente</h2>
          <button onClick={closeModal} className="text-white hover:text-gray-200 focus:outline-none" aria-label="Cerrar modal">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Fecha</label>
              <input type="date" value={dia} onChange={(e) => setDia(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Hora</label>
              <select value={hora} onChange={(e) => setHora(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="" disabled>Selecciona una hora</option>
                {generarHoras().map((horaOption,index)=>(<option key={index} value={horaOption}>{horaOption}</option>))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Nombre del Paciente</label>
              <input type="text" value={paciente} onChange={(e)=>setPaciente(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Prácticas</label>
              <input type="text" value={practicas} onChange={(e)=>setPracticas(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            <div className="flex items-center space-x-2">
              <input type="checkbox" checked={estudioUrgoginecologico} onChange={handleCheckboxChange} className="h-4 w-4"/>
              <label className="text-sm text-gray-200">Estudio Uroginecológico</label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Obra Social</label>
              <select value={obraSocial} onChange={(e)=>setObraSocial(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500">
                {obrasSociales.map((option,index)=>(<option key={index} value={option}>{option}</option>))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">Institución</label>
              <input type="text" value={institucion} onChange={(e)=>setInstitucion(e.target.value)} required className="w-full p-2 border border-gray-300 rounded-md text-black focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>

          {error && <div className="col-span-full text-red-500 text-sm p-2 bg-red-50 rounded-md">{error}</div>}

          <div className="col-span-full flex flex-col sm:flex-row justify-between gap-3 mt-4">
            <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-emerald-500 text-white rounded-md hover:bg-emerald-600">Guardar cambios</button>
            <button type="button" onClick={closeModal} className="w-full sm:w-auto px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditPatientModal;
