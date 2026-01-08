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
            if (tipo === "obras-sociales") return Array.isArray(data.obrasSociales) ? data.obrasSociales : [];

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
        if (!user?.id) return;

        Promise.all([
            fetchOptions("medicos"),
            fetchOptions("tipos"),
            fetchOptions("obras-sociales")
        ]).then(([medicosApi, tipos, obrasApi]) => {

            const medicosDesdeCirugias = allCirugias.flatMap(c =>
                [c.medicoOpero, c.medicoAyudo1, c.medicoAyudo2].filter(
                    (m): m is string => !!m && m.trim() !== ""
                )
            );

            const obrasDesdeCirugias = allCirugias
                .map(c => c.obraSocial)
                .filter((o): o is string => !!o && o.trim() !== "");

            setOptions({
                tipos,
                medicos: Array.from(new Set([...medicosApi, ...medicosDesdeCirugias])),
                obrasSociales: Array.from(new Set([...obrasApi, ...obrasDesdeCirugias]))
            });
        });
    }, [user?.id, fetchTrigger, fetchOptions, allCirugias]);

    useEffect(() => {
        fetchCirugias();
    }, [fetchCirugias, fetchTrigger]);

    return { allCirugias, loading, options };
};
