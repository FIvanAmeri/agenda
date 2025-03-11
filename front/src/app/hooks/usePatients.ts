import { useState, useEffect } from "react";
import Patient from "../components/interfaz/interfaz";

const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/paciente");
        if (!response.ok) throw new Error("No se pudo obtener los pacientes");
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return { patients, loading, error, setPatients };
};

export default usePatients;
