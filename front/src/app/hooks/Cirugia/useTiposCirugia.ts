import { useState, useEffect } from "react";

export const useTiposCirugia = () => {
  const [tipos, setTipos] = useState<{ id: number; nombre: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchTipos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:3001/api/tipo-cirugia");
        if (!res.ok) throw new Error("Error al obtener tipos");
        const data = await res.json();
        if (mounted) setTipos(data.tipos ?? []);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchTipos();
    return () => {
      mounted = false;
    };
  }, []);

  return { tipos, setTipos, loading, error };
};
