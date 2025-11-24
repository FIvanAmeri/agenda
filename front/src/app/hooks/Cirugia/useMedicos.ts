import { useState, useEffect } from "react";

export const useMedicos = () => {
  const [medicos, setMedicos] = useState<{ id: number; nombre: string; apellido: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchMedicos = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("http://localhost:3001/api/medico");
        if (!res.ok) throw new Error("Error al obtener médicos");
        const data = await res.json();
        if (mounted) setMedicos(data.medicos ?? []);
      } catch (err) {
        if (mounted) setError(err instanceof Error ? err.message : "Error");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchMedicos();
    return () => {
      mounted = false;
    };
  }, []);

  return { medicos, setMedicos, loading, error };
};
