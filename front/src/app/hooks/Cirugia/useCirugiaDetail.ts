import { useState, useEffect } from "react";
import { Cirugia } from "../../components/interfaz/interfaz";
import { format } from 'date-fns';

const formatDateForInput = (isoDate: string | null | undefined): string => {
    if (!isoDate) return "";
    return format(new Date(isoDate + 'T00:00:00'), 'yyyy-MM-dd');
};

export const useCirugiaDetail = (
    cirugia: Cirugia,
    onSubmit?: (id: string, data: Partial<Cirugia>) => Promise<void>
) => {
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

    const isDirty = Object.keys(formData).some(key => {
        const formValue = formData[key as keyof Partial<Cirugia>];
        const originalValue = cirugia[key as keyof Cirugia];
        const normalizedFormValue = (formValue === null || formValue === undefined) ? "" : String(formValue);
        const normalizedOriginalValue = (originalValue === null || originalValue === undefined) ? "" : String(originalValue);
        return normalizedFormValue !== normalizedOriginalValue;
    });

    const executeSubmit = async (e: React.FormEvent): Promise<void> => {
        e.preventDefault();
        if (cirugia.id === undefined || cirugia.id === null || !onSubmit) return;
        setLoading(true);
        await onSubmit(String(cirugia.id), formData);
        setLoading(false);
    };

    return {
        formData,
        loading,
        isDirty,
        handleInputChange,
        handleNumericChange,
        executeSubmit
    };
};