import { Cirugia } from "../../components/interfaz/interfaz";

export interface PaymentSectionConfig {
    title: string;
    totalName: keyof Cirugia;
    paidName: keyof Cirugia;
    statusName: keyof Cirugia;
}

export const PAYMENT_SECTIONS_CONFIG: PaymentSectionConfig[] = [
    {
        title: "Honorarios",
        totalName: "montoTotalHonorarios",
        paidName: "montoPagadoHonorarios",
        statusName: "estadoPagoHonorarios"
    },
    {
        title: "Presupuesto",
        totalName: "montoTotalPresupuesto",
        paidName: "montoPagadoPresupuesto",
        statusName: "estadoPagoPresupuesto"
    }
];