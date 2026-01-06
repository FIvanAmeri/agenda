import { useState, useEffect, useCallback } from "react";
import { User, Cirugia, FiltrosCirugia } from "../../components/interfaz/interfaz";

export const useCirugias = (user: User | null, filters: FiltrosCirugia, fetchTrigger: number) => {
    const [allCirugias, setAllCirugias] = useState<Cirugia[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [options, setOptions] = useState({
        tipos: [] as string[],
        medicos: [] as string[],
        obrasSociales: [] as string[]
    });

    const fetchOptions = useCallback(async (tipo: string): Promise<string[]> => {
        if (!user?.id) return [];
        try {
            const res = await fetch(`/api/cirugias/${tipo}?usuarioId=${user.id}`);
            if (!res.ok) return [];
            const data = await res.json();
            
            if (tipo === "medicos") return Array.isArray(data.medicos) ? data.medicos : [];
            if (tipo === "tipos") return Array.isArray(data.tiposCirugia) ? data.tiposCirugia : [];
            if (tipo === "obrassociales") return Array.isArray(data.obrasSociales) ? data.obrasSociales : [];
            
            return [];
        } catch {
            return [];
        }
    }, [user?.id]);

    const fetchCirugias = useCallback(async (): Promise<void> => {
        if (!user?.id) return;
        setLoading(true);
        try {
            const params = new URLSearchParams();
            params.append("usuarioId", user.id.toString());
            const res = await fetch(`/api/cirugias?${params.toString()}`);
            const data = await res.json();
            setAllCirugias(Array.isArray(data.data) ? data.data : []);
        } catch {
            setAllCirugias([]);
        } finally {
            setLoading(false);
        }
    }, [user?.id]);

    useEffect(() => {
        if (user?.id) {
            Promise.all([
                fetchOptions("medicos"),
                fetchOptions("tipos"),
                fetchOptions("obrassociales")
            ]).then(([medicos, tipos, obras]) => {
                setOptions({ medicos, tipos, obrasSociales: obras });
            });
        }
    }, [user?.id, fetchTrigger, fetchOptions]);

    useEffect(() => {
        fetchCirugias();
    }, [fetchCirugias, fetchTrigger]);

    return { allCirugias, loading, options };
};