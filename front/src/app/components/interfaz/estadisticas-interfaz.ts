export interface ResumenPagos {
    mensuales: number[];
    totalAnual: number;
}

export interface DistribucionEdades {
    [rango: string]: number;
}

export interface DetalleInstitucion {
    pacientes: number;
    totalCobrado: number;
}

export interface PorInstitucion {
    [nombre: string]: DetalleInstitucion;
}

export interface PorObraSocial {
    [nombre: string]: number;
}

export interface VisitaPaciente {
    visitas: number;
    motivos: string[];
}

export interface FrecuenciaPacientes {
    [nombrePaciente: string]: VisitaPaciente;
}

export interface MetricasPracticas {
    [claveInstitucionPractica: string]: number;
}

export interface EstadisticasData {
    resumenPagos: ResumenPagos;
    distribucionEdades: DistribucionEdades;
    porInstitucion: PorInstitucion;
    porObraSocial: PorObraSocial;
    frecuenciaPacientes: FrecuenciaPacientes;
    metricasPracticas: MetricasPracticas;
}