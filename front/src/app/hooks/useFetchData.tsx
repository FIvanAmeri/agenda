import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Patient  from '../components/interfaz/interfaz';

const useFetchData = () => {
  const router = useRouter();
  
  const [patients, setPatients] = useState<Patient[]>([]);
  const [user, setUser] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?.usuario) {
      setUser(storedUser.usuario.trim().charAt(0).toUpperCase() + storedUser.usuario.trim().slice(1));
    }

    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/paciente");
        if (!response.ok) throw new Error("No se pudo obtener los pacientes");
        const data: Patient[] = await response.json();
        setPatients(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      }
    };

    fetchPatients();
  }, [router]);

  return { patients, setPatients, user, error };
};

export default useFetchData;
