import { useState, useEffect, useCallback } from "react";
import { DatosFormularioPaciente, PropsUseFormularioPaciente, ResultadoUseFormularioPaciente } from "../../components/interfaz/tipos-paciente";
import { extractTime, formatDate } from "../../utils/dateTimeHelpers";

export const useFormularioPaciente = ({
    selectedPatient,
    updatePatient,
    setShowEditModal,
    obrasSociales,
}: PropsUseFormularioPaciente): ResultadoUseFormularioPaciente => {
    
    const [formData, setFormData] = useState<DatosFormularioPaciente>({
        dia: formatDate(selectedPatient.dia),
        hora: extractTime(selectedPatient.hora),
        paciente: selectedPatient.paciente,
        practicas: selectedPatient.practicas,
        obraSocial: selectedPatient.obraSocial,
        institucion: selectedPatient.institucion,
        estudioUrgoginecologico: selectedPatient.practicas.includes("(U)")
    });

    const [error, setError] = useState<string | null>(null);

    const closeModal = useCallback(() => {
        setShowEditModal(false);
    }, [setShowEditModal]);

    useEffect(() => {
        setFormData({
            dia: formatDate(selectedPatient.dia),
            hora: extractTime(selectedPatient.hora),
            paciente: selectedPatient.paciente,
            practicas: selectedPatient.practicas,
            obraSocial: selectedPatient.obraSocial,
            institucion: selectedPatient.institucion,
            estudioUrgoginecologico: selectedPatient.practicas.includes("(U)")
        });
    }, [selectedPatient]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name as keyof DatosFormularioPaciente]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setFormData(prev => ({
            ...prev,
            estudioUrgoginecologico: isChecked,
            practicas: isChecked 
                ? prev.practicas.includes("(U)") ? prev.practicas : `${prev.practicas} (U)`
                : prev.practicas.replace(" (U)", "")
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const updatedPatient = {
            id: selectedPatient.id,
            hora: `${formData.dia}T${formData.hora}:00`,
            dia: formData.dia,
            paciente: formData.paciente,
            practicas: formData.practicas,
            obraSocial: formData.obraSocial,
            institucion: formData.institucion,
        };

        try {
            const response = await fetch(`http://localhost:3001/api/paciente/${selectedPatient.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedPatient),
            });

            if (!response.ok) {
                throw new Error("Error al actualizar el paciente");
            }

            const result = await response.json();
            updatePatient(result.paciente);
            closeModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Hubo un error al actualizar");
        }
    };

    return {
        formData,
        error,
        obrasSociales,
        handleInputChange,
        handleCheckboxChange,
        handleSubmit,
        closeModal,
    };
};