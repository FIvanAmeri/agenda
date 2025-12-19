"use client";

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useObrasSociales } from '../../hooks/useObrasSociales';
import { Patient, User } from "../interfaz/interfaz";
import { DatosFormularioPaciente } from "../interfaz/tipos-paciente";
import { ModalBase } from "./ModalBase";
import { PatientFormFields } from "../PatientFormFields";
import { FormActions } from "../FormActions";
import { ErrorDisplay } from "../ErrorDisplay";
import { ModalAgregarOpcion } from "../Cirugia/ModalAgregarOpcion";

interface AddPatientModalProps {
    user: User;
    onClose: () => void;
    onAdd: (newPatient: Patient) => void;
    existingPatients?: Patient[];
}

const AddPatientModal: React.FC<AddPatientModalProps> = ({ 
    user, 
    onClose, 
    onAdd, 
    existingPatients = [] 
}) => {
    const { obrasSociales: initialObrasSociales } = useObrasSociales();
    const modalRef = useRef<HTMLDivElement>(null);
    const [extraObrasSociales, setExtraObrasSociales] = useState<string[]>([]);
    const [extraInstituciones, setExtraInstituciones] = useState<string[]>([]);
    const [extraPracticas, setExtraPracticas] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        target: 'obraSocial' | 'institucion' | 'practicas';
        label: string;
    }>({
        isOpen: false,
        target: 'obraSocial',
        label: ''
    });

    const combinedObrasSociales = useMemo(() => {
        const set = new Set([...initialObrasSociales, ...extraObrasSociales]);
        return Array.from(set).sort((a, b) => a.localeCompare(b));
    }, [initialObrasSociales, extraObrasSociales]);

    const getCurrentLocalDate = (): string => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [formData, setFormData] = useState<DatosFormularioPaciente>({
        dia: getCurrentLocalDate(),
        hora: '',
        paciente: '',
        fechaNacimiento: null,
        practicas: '',
        obraSocial: '',
        institucion: '',
        estudioUrgoginecologico: false
    });

    const [error, setError] = useState<string | null>(null);

    const suggestions = useMemo(() => {
        if (!existingPatients || existingPatients.length === 0 || !formData.paciente || formData.paciente.length < 2) {
            return [];
        }
        const term = formData.paciente.toLowerCase().trim();
        const filtered = existingPatients.filter(p => p.paciente && p.paciente.toLowerCase().includes(term));
        const uniqueMap = new Map<string, Patient>();
        filtered.forEach(p => {
            const key = p.paciente.toLowerCase().trim();
            if (!uniqueMap.has(key)) uniqueMap.set(key, p);
        });
        return Array.from(uniqueMap.values()).slice(0, 5);
    }, [formData.paciente, existingPatients]);

    const closeModal = useCallback(() => { onClose(); }, [onClose]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (name === 'paciente') setShowSuggestions(true);
    };

    const handleSelectPatient = (p: Patient) => {
        setFormData(prev => ({
            ...prev,
            paciente: p.paciente,
            fechaNacimiento: p.fechaNacimiento,
            obraSocial: p.obraSocial
        }));
        setShowSuggestions(false);
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

    const openAddModal = (target: 'obraSocial' | 'institucion' | 'practicas', label: string) => {
        setModalConfig({ isOpen: true, target, label });
    };

    const handleSaveNewOption = (newValue: string) => {
        if (modalConfig.target === 'obraSocial') {
            setExtraObrasSociales(prev => [...prev, newValue]);
            setFormData(prev => ({ ...prev, obraSocial: newValue }));
        } else if (modalConfig.target === 'institucion') {
            setExtraInstituciones(prev => [...prev, newValue]);
            setFormData(prev => ({ ...prev, institucion: newValue }));
        } else if (modalConfig.target === 'practicas') {
            setExtraPracticas(prev => [...prev, newValue]);
            setFormData(prev => ({ ...prev, practicas: newValue }));
        }
        setModalConfig(prev => ({ ...prev, isOpen: false }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newPatientRequest = { ...formData, userId: Number(user.id), estadoPago: 'no pagado', montoPagado: 0, montoTotal: 0, fechaPagoParcial: null, fechaPagoTotal: null };
        const token = localStorage.getItem("token");
        try {
            const response = await fetch('http://localhost:3001/api/paciente', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(newPatientRequest),
            });
            if (!response.ok) throw new Error('Error al crear el paciente');
            const result = await response.json();
            onAdd(result.paciente);
            closeModal();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Hubo un error');
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden">
            <div className="md:ml-64 w-full max-w-sm md:max-w-xl lg:max-w-4xl mx-auto" ref={modalRef}>
                <ModalBase title="Agregar Paciente" onClose={closeModal}>
                    <form onSubmit={handleSubmit} className="space-y-6 overflow-visible">
                        <PatientFormFields
                            formData={formData}
                            obrasSociales={combinedObrasSociales}
                            onInputChange={handleInputChange}
                            onCheckboxChange={handleCheckboxChange}
                            suggestions={suggestions}
                            showSuggestions={showSuggestions}
                            onSelectPatient={handleSelectPatient}
                        />
                        <div className="flex flex-wrap gap-4 pt-4 border-t border-cyan-800/30">
                            <button type="button" onClick={() => openAddModal('obraSocial', 'Nueva Obra Social')} className="text-[10px] flex items-center gap-2 text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-md border border-cyan-800"><span>+</span> Obra Social</button>
                            <button type="button" onClick={() => openAddModal('institucion', 'Nueva Institución')} className="text-[10px] flex items-center gap-2 text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-md border border-cyan-800"><span>+</span> Institución</button>
                            <button type="button" onClick={() => openAddModal('practicas', 'Nueva Práctica')} className="text-[10px] flex items-center gap-2 text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-md border border-cyan-800"><span>+</span> Práctica</button>
                        </div>
                        <ErrorDisplay error={error} />
                        <FormActions onCancel={closeModal} submitText="Agregar" />
                    </form>
                </ModalBase>
            </div>
            {modalConfig.isOpen && <ModalAgregarOpcion etiqueta={modalConfig.label} onClose={() => setModalConfig(prev => ({ ...prev, isOpen: false }))} onSave={handleSaveNewOption} />}
        </div>
    );
};

export default AddPatientModal;