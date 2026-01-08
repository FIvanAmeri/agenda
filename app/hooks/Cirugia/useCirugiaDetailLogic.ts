"use client";

import { useState, useEffect, useCallback } from "react";
import { Cirugia, DatosFormularioCirugia } from "../../components/interfaz/interfaz";
import { format } from 'date-fns';

interface UseCirugiaDetailLogicProps {
    cirugia: Cirugia;
    onSubmit?: (id: number, data: Partial<Cirugia>) => Promise<void>;
}

const formatDateForInput = (isoDate: string | null | undefined): string => {
    if (!isoDate) return "";
    try {
        return format(new Date(isoDate + 'T00:00:00'), 'yyyy-MM-dd');
    } catch {
        return "";
    }
};

export const useCirugiaDetailLogic = ({ cirugia, onSubmit }: UseCirugiaDetailLogicProps) => {
    const [formData, setFormData] = useState<DatosFormularioCirugia>({
        fecha: "",
        paciente: "",
        fechaNacimientoPaciente: "",
        tipoCirugia: "",
        obraSocial: "",
        medicoOpero: "",
        medicoAyudo1: "",
        medicoAyudo2: "",
        montoTotalHonorarios: "0",
        montoTotalPresupuesto: "0",
        descripcion: ""
    });
    
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (cirugia) {
            setFormData({
                fecha: formatDateForInput(cirugia.fecha),
                paciente: cirugia.paciente || "",
                fechaNacimientoPaciente: formatDateForInput(cirugia.fechaNacimientoPaciente),
                tipoCirugia: cirugia.tipoCirugia || "",
                obraSocial: cirugia.obraSocial || "",
                medicoOpero: cirugia.medicoOpero || "",
                medicoAyudo1: cirugia.medicoAyudo1 || "",
                medicoAyudo2: cirugia.medicoAyudo2 || "",
                montoTotalHonorarios: cirugia.montoTotalHonorarios?.toString() || "0",
                montoTotalPresupuesto: cirugia.montoTotalPresupuesto?.toString() || "0",
                descripcion: cirugia.descripcion || ""
            });
        }
    }, [cirugia]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (cirugia.id === undefined || !onSubmit) return;
        setLoading(true);
        
        // Transformamos DatosFormularioCirugia de nuevo a Partial<Cirugia> para el submit
        const payload: Partial<Cirugia> = {
            ...formData,
            montoTotalHonorarios: Number(formData.montoTotalHonorarios),
            montoTotalPresupuesto: Number(formData.montoTotalPresupuesto),
        };

        try {
            await onSubmit(cirugia.id, payload);
        } finally {
            setLoading(false);
        }
    };

    const isDirty = Object.keys(formData).some(key => {
        const currentVal = formData[key as keyof DatosFormularioCirugia];
        let originalVal: any = cirugia[key as keyof Cirugia];

        if (key === 'fecha' || key === 'fechaNacimientoPaciente') {
            originalVal = formatDateForInput(originalVal);
        } else if (key === 'montoTotalHonorarios' || key === 'montoTotalPresupuesto') {
            originalVal = originalVal?.toString() || "0";
        } else {
            originalVal = originalVal || "";
        }

        return String(currentVal) !== String(originalVal);
    });

    return {
        formData,
        loading,
        handleInputChange,
        handleSubmit,
        isDirty,
        setFormData
    };
};