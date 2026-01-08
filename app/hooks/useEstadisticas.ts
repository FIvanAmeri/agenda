import { useState, useCallback } from "react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

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

export interface EstadisticasData {
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

export interface UseEstadisticasResult {
    stats: EstadisticasData | null;
    loading: boolean;
    error: string | null;
    fetchStats: (anio: number) => Promise<void>;
}

const useEstadisticas = (): UseEstadisticasResult => {
    const { user } = useAuth();
    const [stats, setStats] = useState<EstadisticasData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async (anio: number) => {
        if (!user?.id) return;
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<EstadisticasData>(`/estadisticas`, {
                params: {
                    usuarioId: user.id,
                    anio: anio
                }
            });
            setStats(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar estadísticas");
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    return { stats, loading, error, fetchStats };
};

export default useEstadisticas;