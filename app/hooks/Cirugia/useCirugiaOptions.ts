import { useState, useEffect, useCallback } from "react";
import { User } from "../../components/interfaz/interfaz";

export const useCirugiaOptions = (user: User | null) => {
    const [options, setOptions] = useState({
        medicos: [] as string[],
        tipos: [] as string[],
        obrasSociales: [] as string[]
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOptions = useCallback(async () => {
        if (!user?.id) return;
        setLoading(true);
        setError(null);
        try {
            const queryParams = `?usuarioId=${user.id}`;
            const [medicosRes, tiposRes, osRes] = await Promise.all([
                fetch(`/api/cirugias/medicos${queryParams}`),
                fetch(`/api/cirugias/tipos${queryParams}`),
                fetch(`/api/cirugias/obras-sociales${queryParams}`)
            ]);

            if (!medicosRes.ok || !tiposRes.ok || !osRes.ok) throw new Error("Error al cargar listas");

            const medicosData = await medicosRes.json();
            const tiposData = await tiposRes.json();
            const osData = await osRes.json();

            setOptions({
                medicos: Array.isArray(medicosData.medicos) ? medicosData.medicos : [],
                tipos: Array.isArray(tiposData.tiposCirugia) ? tiposData.tiposCirugia : [],
                obrasSociales: Array.isArray(osData.obrasSociales) ? osData.obrasSociales : []
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Error desconocido");
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        fetchOptions();
    }, [fetchOptions]);

    return { options, setOptions, loading, error, refetch: fetchOptions };
};