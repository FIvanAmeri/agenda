import api from "../services/api"

export interface DetalleEstadistica {
  cantidad: number
  pacientes: string[]
}

export interface ResumenMensual {
  monto: number
  pacientes: string[]
}

export interface EstadisticasResponse {
  totalPacientes: number
  totalCirugias: number
  totalIngresos: number
  detallePorObraSocial: Record<string, DetalleEstadistica>
  resumenMensual: Record<string, ResumenMensual>
}

export const obtenerEstadisticas = (anio?: number) => {
  return api.get<EstadisticasResponse>("/estadisticas", {
    params: anio ? { anio } : undefined,
  })
}
