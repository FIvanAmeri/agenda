import { Cirugia } from "../components/interfaz/interfaz";

export const formatCurrencyARS = (amount: number | null): string => {
    if (amount === null || amount === undefined) return "$ 0.00";
    const numericAmount: number = Number(amount);
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numericAmount);
};

export const formatCurrencyUSD = (amount: number | null): string => {
    if (amount === null || amount === undefined) return "USD 0.00";
    const numericAmount: number = Number(amount);
    const formatted: string = new Intl.NumberFormat('en-US', {
        style: 'decimal',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numericAmount);
    return `USD ${formatted}`;
};

export const formatDateForDisplay = (isoDate: string): string => {
    const date: Date = new Date(isoDate + 'T00:00:00');
    const day: string = String(date.getDate()).padStart(2, "0");
    const month: string = String(date.getMonth() + 1).padStart(2, "0");
    const year: number = date.getFullYear();
    return `${day}/${month}/${year}`;
};

export const getEstadoClass = (estado: Cirugia["estadoPagoHonorarios"]): string => {
    if (estado === "pagado") return "bg-green-600/20 border-green-500/50";
    if (estado === "parcialmente pagado") return "bg-yellow-600/20 border-yellow-500/50";
    return "bg-red-600/20 border-red-500/50";
};