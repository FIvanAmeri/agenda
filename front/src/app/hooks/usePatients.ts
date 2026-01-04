"use client";

import { useState, useEffect, useCallback } from "react";
import { Patient } from "../components/interfaz/interfaz";
import useAuth from "./useAuth";

interface UsePatientsResult {
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  loading: boolean;
  error: string | null;
  deletePatient: (id: number) => Promise<void>;
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
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);

      if (!token) {
        setError("No hay token. Redirigiendo a inicio.");
        setLoading(false);
        return;
      }

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

  const deletePatient = useCallback(async (id: number) => {
    if (!token) return;

    try {
      const response = await fetch(`http://localhost:3001/api/paciente/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Error al eliminar el paciente");
      }

      setPatients((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error al eliminar";
      setError(message);
      throw err;
    }
  }, [token]);

  return { patients, setPatients, loading, error, deletePatient };
}