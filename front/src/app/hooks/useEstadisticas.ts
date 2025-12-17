import { useState, useCallback } from "react";
import api from "../services/api";

interface DetalleEstadistica {
    cantidad: number;
    pacientes: string[];
}

interface EstadisticasData {
    resumenPagos: {
        mensuales: {
            monto: number;
            pacientes: string[];
        }[];
        totalAnual: number;
    };
    distribucionEdades: Record<string, DetalleEstadistica>;
    porObraSocial: Record<string, DetalleEstadistica>;
    metricasPracticas: Record<string, DetalleEstadistica>;
}

interface UseEstadisticasResult {
    stats: EstadisticasData | null;
    loading: boolean;
    error: string | null;
    fetchStats: (anio: number) => Promise<void>;
}

const useEstadisticas = (): UseEstadisticasResult => {
    const [stats, setStats] = useState<EstadisticasData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async (anio: number) => {
        setLoading(true);
        setError(null);
        try {
            const response = await api.get<EstadisticasData>(`/estadisticas?anio=${anio}`);
            setStats(response.data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error al cargar estadísticas");
        } finally {
            setLoading(false);
        }
    }, []);

    return { stats, loading, error, fetchStats };
};

export default useEstadisticas;