import { useState, useEffect, useCallback } from "react";
import { DatosFormularioPaciente, PropsUseFormularioPaciente, ResultadoUseFormularioPaciente } from "../../components/interfaz/tipos-paciente";
import { extractTime, formatDate } from "../../utilidades/dateTimeHelpers";

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
        fechaNacimiento: selectedPatient.fechaNacimiento || "",
        estudioUrgoginecologico: (selectedPatient.practicas || "").includes(" (U)")
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
            fechaNacimiento: selectedPatient.fechaNacimiento || "",
            estudioUrgoginecologico: (selectedPatient.practicas || "").includes(" (U)")
        });
    }, [selectedPatient]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name as keyof DatosFormularioPaciente]: value }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const isChecked = e.target.checked;
        setFormData(prev => {
            const currentPracticas = prev.practicas || "";
            return {
                ...prev,
                estudioUrgoginecologico: isChecked,
                practicas: isChecked 
                    ? currentPracticas.includes(" (U)") ? currentPracticas : `${currentPracticas} (U)`
                    : currentPracticas.replace(" (U)", "")
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");

        if (!storedUser || !token) {
            setError("Error de sesión");
            return;
        }

        const userObj = JSON.parse(storedUser);
        const userIdNum = parseInt(userObj.id, 10);
        const patientIdNum = parseInt(String(selectedPatient.id), 10);

        if (isNaN(userIdNum) || isNaN(patientIdNum)) {
            setError("IDs inválidos");
            return;
        }

        const updatedPatient = {
            id: patientIdNum,
            userId: userIdNum,
            hora: `${formData.dia}T${formData.hora}:00`,
            dia: formData.dia,
            paciente: formData.paciente,
            practicas: formData.practicas,
            obraSocial: formData.obraSocial,
            institucion: formData.institucion,
            fechaNacimiento: formData.fechaNacimiento || null,
        };

        try {
            const response = await fetch(`/api/pacientes/${patientIdNum}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedPatient),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || "Error");
            }

            updatePatient(result.paciente);
            closeModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error");
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