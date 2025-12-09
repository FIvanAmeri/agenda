import { Patient } from "./interfaz";

export type EstadoPago = Patient["estadoPago"];

export interface PacienteParaPago {
  id: number;
  estadoPagoActual: EstadoPago;
  montoPagadoActual: number;
  montoTotalActual: number;
}