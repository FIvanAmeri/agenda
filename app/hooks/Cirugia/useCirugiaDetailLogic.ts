"use client";

import { useState, useEffect } from "react";
import { Cirugia } from "../../components/interfaz/interfaz";
import { format } from 'date-fns';

interface UseCirugiaDetailLogicProps {
    cirugia: Cirugia;
    onSubmit?: (id: number, data: Partial<Cirugia>) => Promise<void>;
}

const formatDateForInput = (isoDate: string | null | undefined): string => {
    if (!isoDate) return "";
    return format(new Date(isoDate + 'T00:00:00'), 'yyyy-MM-dd');
};

export const useCirugiaDetailLogic = ({ cirugia, onSubmit }: UseCirugiaDetailLogicProps) => {
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
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        const numericValue = value === "" ? null : Number(value);
        setFormData((prev) => ({ ...prev, [name]: numericValue }));
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (cirugia.id === undefined || !onSubmit) return;
        setLoading(true);
        await onSubmit(cirugia.id, formData);
        setLoading(false);
    };

    const isDirty = Object.keys(formData).some(key => {
        const formValue = formData[key as keyof Partial<Cirugia>];
        const originalValue = cirugia[key as keyof Cirugia];
        const normalizedFormValue = (formValue === null || formValue === undefined) ? "" : String(formValue);
        const normalizedOriginalValue = (originalValue === null || originalValue === undefined) ? "" : String(originalValue);
        
        return normalizedFormValue !== normalizedOriginalValue;
    });

    return {
        formData,
        loading,
        handleInputChange,
        handleNumericChange,
        handleSubmit,
        isDirty
    };
};