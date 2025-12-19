import { format } from 'date-fns';

export const formatISO = (date: Date | null): string => {
    if (!date) return "";
    const d: string = date.getDate().toString().padStart(2, "0");
    const m: string = (date.getMonth() + 1).toString().padStart(2, "0");
    const y: number = date.getFullYear();
    return `${y}-${m}-${d}`;
};

export const parseISO = (iso: string): Date | null => {
    if (!iso) return null;
    const parts: string[] = iso.split("-");
    if (parts.length !== 3) return new Date(iso);
    const y: number = Number(parts[0]);
    const m: number = Number(parts[1]) - 1;
    const d: number = Number(parts[2]);
    return new Date(y, m, d);
};

export const parseDatePickerValue = (date: Date | null): string => {
    return formatISO(date);
};