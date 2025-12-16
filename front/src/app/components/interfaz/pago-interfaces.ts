import type { Patient } from "../interfaz/interfaz";

export type EstadoPago = Patient["estadoPago"];

export interface PacienteParaPago {
    id: number;
    estadoPagoActual: EstadoPago;
    montoPagadoActual: number;
    montoTotalActual: number;
    fechaPagoParcial: string | null;
    fechaPagoTotal: string | null;
    ultimoPagoParcial?: number;
    ultimoPagoTotal?: number;
}