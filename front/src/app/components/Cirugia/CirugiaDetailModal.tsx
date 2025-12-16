"use client";

import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { Cirugia } from "../../components/interfaz/interfaz";
import { CirugiaDetailModalProps } from "../../components/interfaz/tipos-cirugia";
import { format } from 'date-fns';

const formatDateForInput = (isoDate: string | null | undefined): string => {
    if (!isoDate) {
        return "";
    }
    return format(new Date(isoDate + 'T00:00:00'), 'yyyy-MM-dd');
};

const getPaymentStatusClass = (status: Cirugia["estadoPagoHonorarios"] | Cirugia["estadoPagoPresupuesto"]): string => {
    switch (status) {
        case "pagado":
            return "bg-green-600/50";
        case "parcialmente pagado":
            return "bg-yellow-600/50";
        case "no pagado":
            return "bg-red-600/50";
        default:
            return "bg-gray-600/50";
    }
};

interface SelectFieldProps { 
    name: string
    label: string
    value: string 
    options: string[]
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
    isRequired?: boolean 
}

const SelectField: React.FC<SelectFieldProps> = ({ name, label, value, options, onChange, isRequired = false }) => {
    
    const normalizedValue: string = value || "";

    const selectedValue: string = normalizedValue; 

    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{label} {isRequired ? "*" : ""}</label>
            <select
                name={name}
                value={selectedValue} 
                onChange={onChange}
                required={isRequired}
                className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
            >
                <option value="">{`Seleccionar ${label.toLowerCase()}`}</option>
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
};

const PaymentStatusSelect: React.FC<{ name: string, label: string, value: string, onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }> = ({ name, label, value, onChange }) => {
    const statusOptions: Array<Cirugia["estadoPagoHonorarios"]> = ["no pagado", "parcialmente pagado", "pagado"];
    return (
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">{label}</label>
            <select
                name={name}
                value={value}
                onChange={onChange}
                className={`w-full p-2 border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500 ${getPaymentStatusClass(value as Cirugia["estadoPagoHonorarios"])}`}
            >
                {statusOptions.map((option) => (
                    <option key={option} value={option}>
                        {option.toUpperCase()}
                    </option>
                ))}
            </select>
        </div>
    );
};


export default function CirugiaDetailModal({ 
    cirugia, 
    onClose, 
    onSubmit,
    medicosOpciones,
    tiposCirugiaOpciones,
    obrasSocialesOpciones,
    showHonorarios,
}: CirugiaDetailModalProps): JSX.Element {
    const [formData, setFormData] = useState<Partial<Cirugia>>({});
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (cirugia) {
            setFormData({
                ...cirugia,
                tipoCirugia: cirugia.tipoCirugia || "",
                medicoOpero: cirugia.medicoOpero || "",
                medicoAyudo1: cirugia.medicoAyudo1 || "",
                medicoAyudo2: cirugia.medicoAyudo2 || "",
                obraSocial: cirugia.obraSocial || "",
                
                fecha: formatDateForInput(cirugia.fecha),
                fechaNacimientoPaciente: formatDateForInput(cirugia.fechaNacimientoPaciente) 
            });
        }
    }, [cirugia]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        const numericValue: number | null = value === "" ? null : Number(value); 
        setFormData((prev) => ({
            ...prev,
            [name]: numericValue,
        }));
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (!cirugia.id || !onSubmit) return;

        setLoading(true);
        await onSubmit(cirugia.id, formData);
        setLoading(false);
    };

    
    const isDirty: boolean = Object.keys(formData).some(key => {
        const formValue = formData[key as keyof Partial<Cirugia>];
        const originalValue = cirugia[key as keyof Cirugia];
        const normalizedFormValue = (formValue === null || formValue === undefined) ? "" : String(formValue);
        const normalizedOriginalValue = (originalValue === null || originalValue === undefined) ? "" : String(originalValue);

        return normalizedFormValue !== normalizedOriginalValue;
    });


    if (!formData.id) return <></>;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
            <div className="bg-[#0F2A35] rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto transform transition-all duration-300">
                <div className="sticky top-0 bg-gradient-to-r from-[#004d40] to-[#1a4553] p-4 flex justify-between items-center text-white z-10">
                    <h2 className="text-2xl font-bold">Editar Cirugía ID: {cirugia.id}</h2>
                    <button onClick={onClose} className="text-white hover:text-red-400 transition">
                        <FaTimes className="text-xl" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-cyan-400">Datos Generales</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Cirugía *</label>
                                <input
                                    type="date"
                                    name="fecha"
                                    value={formData.fecha || ""}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Nombre del Paciente *</label>
                                <input
                                    type="text"
                                    name="paciente"
                                    value={formData.paciente || ""}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Fecha de Nacimiento</label>
                                <input
                                    type="date"
                                    name="fechaNacimientoPaciente"
                                    value={formData.fechaNacimientoPaciente || ""}
                                    onChange={handleInputChange}
                                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <SelectField
                                    name="tipoCirugia"
                                    label="Tipo de Cirugía"
                                    value={formData.tipoCirugia as string} 
                                    options={tiposCirugiaOpciones || []}
                                    onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                                    isRequired={true}
                                />
                            </div>
                            
                            <div>
                                <SelectField
                                    name="obraSocial"
                                    label="Obra Social"
                                    value={formData.obraSocial as string}
                                    options={obrasSocialesOpciones || []}
                                    onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                                />
                            </div>

                            <div className="col-span-full">
                                <label className="block text-sm font-medium text-gray-300 mb-1">Descripción</label>
                                <textarea
                                    name="descripcion"
                                    value={formData.descripcion || ""}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                        </div>
                    </div>

                    <fieldset className="p-4 border border-[#1f3b47] rounded-lg space-y-4">
                        <legend className="text-lg font-semibold text-cyan-400 px-2">Médicos Participantes</legend>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SelectField
                                name="medicoOpero"
                                label="Médico que Operó"
                                value={formData.medicoOpero as string}
                                options={medicosOpciones || []}
                                onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                                isRequired={true}
                            />
                            <SelectField
                                name="medicoAyudo1"
                                label="Médico Ayudante 1"
                                value={formData.medicoAyudo1 as string}
                                options={medicosOpciones || []}
                                onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                            />
                            <SelectField
                                name="medicoAyudo2"
                                label="Médico Ayudante 2"
                                value={formData.medicoAyudo2 as string}
                                options={medicosOpciones || []}
                                onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                            />
                        </div>
                    </fieldset>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <fieldset className="p-4 border border-[#1f3b47] rounded-lg space-y-4">
                            <legend className="text-lg font-semibold text-cyan-400 px-2">Honorarios</legend>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Monto Total</label>
                                <input
                                    type="number"
                                    name="montoTotalHonorarios"
                                    value={formData.montoTotalHonorarios === null || formData.montoTotalHonorarios === undefined ? "" : formData.montoTotalHonorarios}
                                    onChange={handleNumericChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Monto Pagado</label>
                                <input
                                    type="number"
                                    name="montoPagadoHonorarios"
                                    value={formData.montoPagadoHonorarios === null || formData.montoPagadoHonorarios === undefined ? "" : formData.montoPagadoHonorarios}
                                    onChange={handleNumericChange}
                                    min="0"
                                    step="0.01"
                                    required
                                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                            <PaymentStatusSelect
                                name="estadoPagoHonorarios"
                                label="Estado de Pago"
                                value={formData.estadoPagoHonorarios || "no pagado"}
                                onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                            />
                        </fieldset>

                        <fieldset className="p-4 border border-[#1f3b47] rounded-lg space-y-4">
                            <legend className="text-lg font-semibold text-cyan-400 px-2">Presupuesto</legend>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Monto Total</label>
                                <input
                                    type="number"
                                    name="montoTotalPresupuesto"
                                    value={formData.montoTotalPresupuesto === null || formData.montoTotalPresupuesto === undefined ? "" : formData.montoTotalPresupuesto}
                                    onChange={handleNumericChange}
                                    min="0"
                                    step="0.01"
                                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-1">Monto Pagado</label>
                                <input
                                    type="number"
                                    name="montoPagadoPresupuesto"
                                    value={formData.montoPagadoPresupuesto === null || formData.montoPagadoPresupuesto === undefined ? "" : formData.montoPagadoPresupuesto}
                                    onChange={handleNumericChange}
                                    min="0"
                                    step="0.01"
                                    required
                                    className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
                                />
                            </div>
                            <PaymentStatusSelect
                                name="estadoPagoPresupuesto"
                                label="Estado de Pago"
                                value={formData.estadoPagoPresupuesto || "no pagado"}
                                onChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                            />
                        </fieldset>
                    </div>

                    <div className="flex justify-end space-x-4 pt-4 border-t border-[#1f3b47]">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-[#1a4553] transition duration-200"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-[#0c4a34] text-white font-semibold rounded-md hover:bg-[#1f5666] transition duration-200 disabled:opacity-50"
                            disabled={loading || !isDirty}
                        >
                            {loading ? "Guardando..." : "Guardar Cambios"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}