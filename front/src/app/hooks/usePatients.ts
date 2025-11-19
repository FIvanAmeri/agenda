import { useState, useEffect } from "react";
import { Patient } from "../components/interfaz/interfaz";
import useAuth from "./useAuth";

interface UsePatientsResult {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  loading: boolean;
  error: string | null;
}


interface BackendResponse {
    pacientes?: Patient[];
}

export default function usePatients(): UsePatientsResult {
  const { token } = useAuth();
  const [patients, setPatients] = useState<Patient[]>([]); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPatients([]);

    if (!token) {
      setError("No hay token. Redirigiendo a inicio.");
      setLoading(false);
      return;
    }

    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/paciente", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 401) {
          throw new Error("Token inválido o expirado. Vuelva a iniciar sesión.");
        }

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || "Error al obtener pacientes");
        }

   
        const data: Patient[] | BackendResponse = await response.json();
        
        let finalPatients: Patient[] = [];

        if (Array.isArray(data)) {
            finalPatients = data;
        } else if (typeof data === 'object' && data !== null && Array.isArray((data as BackendResponse).pacientes)) {

            finalPatients = (data as BackendResponse).pacientes || [];
        } else {
            console.error("El backend devolvió un formato de datos inesperado:", data);
            throw new Error("Formato de datos de pacientes inválido.");
        }
        
        setPatients(finalPatients);

      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido al cargar pacientes.");

        setPatients([]); 
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [token]);

  return { patients, setPatients, loading, error };
}