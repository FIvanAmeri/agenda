import api from "../services/api";

export interface DetalleEstadistica {
    cantidad: number;
    pacientes: string[];
}

export interface ResumenMensual {
    monto: number;
    pacientes: string[];
}

export interface PagoDetallado {
    fecha: string;
    monto: number;
    paciente: string;
    institucion: string;
}

export interface EstadisticasResponse {
    resumenPagos: {
        mensuales: ResumenMensual[];
        totalAnual: number;
    };
    distribucionEdades: Record<string, DetalleEstadistica>;
    porObraSocial: Record<string, DetalleEstadistica>;
    metricasPracticas: Record<string, DetalleEstadistica>;
    metricasNoPagados: Record<string, DetalleEstadistica>;
    pagosDetallados: PagoDetallado[];
}

export const obtenerEstadisticas = (usuarioId: number, anio: number) => {
    return api.get<EstadisticasResponse>("/estadisticas", {
        params: { usuarioId, anio },
    });
};