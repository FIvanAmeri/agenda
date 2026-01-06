import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Patient } from '../components/interfaz/interfaz';

const useFetchData = () => {
  const router = useRouter();

  const [patients, setPatients] = useState<Patient[]>([]);
  const [user, setUser] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.usuario) {
          const nombre = parsedUser.usuario.trim();
          setUser(nombre.charAt(0).toUpperCase() + nombre.slice(1));
        }
      } catch {
        console.warn("Usuario inválido en localStorage");
      }
    }

    let isMounted = true;

    const fetchPatients = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3001/api/paciente");
        if (!response.ok) throw new Error("No se pudo obtener los pacientes");
        const data: Patient[] = await response.json();
        if (isMounted) setPatients(data);
      } catch (err) {
        if (isMounted) setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchPatients();

    return () => { isMounted = false; };
  }, []);

  return { patients, setPatients, user, error, loading };
};

export default useFetchData;
