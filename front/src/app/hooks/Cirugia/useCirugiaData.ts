import { useState, useEffect, useCallback } from "react";
import { User, Cirugia, FiltrosCirugia } from "../../components/interfaz/interfaz";

interface OptionsResponse {
    data?: string[];
    obrasSociales?: string[];
    medicos?: string[];
    tiposCirugia?: string[];
}

export const useCirugias = (user: User | null, filters: FiltrosCirugia, fetchTrigger: number) => {
    const [allCirugias, setAllCirugias] = useState<Cirugia[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [options, setOptions] = useState({
        tipos: [] as string[],
        medicos: [] as string[],
        obrasSociales: [] as string[]
    });

    const fetchOptions = useCallback(async (endpoint: string): Promise<string[]> => {
        try {
            const token: string | null = localStorage.getItem("token");
            if (!token) return [];
            const res: Response = await fetch(`http://localhost:3001/api/${endpoint}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data: OptionsResponse = await res.json();
            if (res.ok) {
                return data.data || data.obrasSociales || data.medicos || data.tiposCirugia || [];
            }
            return [];
        } catch {
            return [];
        }
    }, []);

    const fetchCirugias = useCallback(async (): Promise<void> => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const token: string | null = localStorage.getItem("token");
            if (!token) return;
            const params: URLSearchParams = new URLSearchParams();
            params.append("usuarioId", user.id.toString());
            if (filters.dateFrom) params.append("dateFrom", filters.dateFrom);
            if (filters.dateTo) params.append("dateTo", filters.dateTo);

            const res: Response = await fetch(`http://localhost:3001/api/cirugia?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data: { data: Cirugia[] } = await res.json();
            if (res.ok && Array.isArray(data.data)) {
                setAllCirugias(data.data);
            } else {
                setAllCirugias([]);
            }
        } catch {
            setAllCirugias([]);
        } finally {
            setLoading(false);
        }
    }, [user?.id, filters.dateFrom, filters.dateTo]);

    useEffect((): void => {
        if (user?.id) {
            Promise.all([
                fetchOptions("cirugia/medicos"),
                fetchOptions("cirugia/tipos"),
                fetchOptions("paciente/obrassociales")
            ]).then(([medicos, tipos, obras]: [string[], string[], string[]]): void => {
                setOptions({ medicos, tipos, obrasSociales: obras });
            });
        }
    }, [user?.id, fetchTrigger, fetchOptions]);

    useEffect((): void => {
        fetchCirugias();
    }, [fetchCirugias, fetchTrigger]);

    return { allCirugias, loading, options };
};