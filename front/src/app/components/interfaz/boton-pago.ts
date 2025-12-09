export type EstadoPago = 'no pagado' | 'parcialmente pagado' | 'pagado';

export interface PacienteParaPago {
  id: number;
  estadoPagoActual: EstadoPago;
}