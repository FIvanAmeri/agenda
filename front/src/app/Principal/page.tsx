"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import Add from "../Add/page";
import { format } from "date-fns";

interface Patient {
  dia: string;
  paciente: string;
  practicas: string;
  obraSocial: string;
}

export default function Principal() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (storedUser?.usuario) {
        const formattedUser = storedUser.usuario.trim();
        if (formattedUser) {
          const userName = formattedUser.charAt(0).toUpperCase() + formattedUser.slice(1);
          setUser(userName);
        }
      }
    }

    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/paciente");
        if (!response.ok) {
          throw new Error("No se pudo obtener los pacientes");
        }
        const data = await response.json();
        setPatients(data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          setError(error.message);
        }
        console.error("Error al obtener pacientes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const addPatient = (newPatient: Patient) => {
    setPatients((prevPatients) => [...prevPatients, newPatient]);
  };

  const filteredPatients = selectedDate
    ? patients.filter((patient) => format(new Date(patient.dia), "yyyy-MM-dd") === selectedDate)
    : patients;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? format(date, "dd/MM/yyyy") : dateString;
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-10 mb-6 text-center">
        Espero que estés teniendo un lindo día, {user}
      </h1>

     
      <button
        onClick={handleLogout}
        className="absolute top-6 right-4 sm:top-6 sm:right-6 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Salir
      </button>

      <div className="w-full px-10">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md transition-all duration-300 relative">
          <div className="mb-4">
            <label htmlFor="date" className="text-black font-bold">Selecciona una fecha:</label>
            <input
              id="date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-2 p-2 border rounded text-black"
            />
          </div>

          {loading && !error ? (
            <div className="text-center text-lg text-gray-500">Cargando pacientes...</div>
          ) : error ? (
            <div className="text-center text-lg text-red-500">Hubo un error al cargar los pacientes</div>
          ) : (
            <table className="w-full text-left table-auto">
              <thead>
                <tr className="bg-lime-200">
                  <th className="px-4 py-2 font-bold text-black">Día</th>
                  <th className="px-4 py-2 font-bold text-black">Paciente</th>
                  <th className="px-4 py-2 font-bold text-black">Prácticas</th>
                  <th className="px-4 py-2 font-bold text-black">Obra Social</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-300 hover:bg-gray-50"
                    >
                      <td className="px-4 py-2 text-black">{formatDate(patient.dia)}</td>
                      <td className="px-4 py-2 text-black">{patient.paciente}</td>
                      <td className="px-4 py-2 text-black">{patient.practicas}</td>
                      <td className="px-4 py-2 text-black">{patient.obraSocial}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-2 text-center text-black font-bold">
                      No hay pacientes disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

      
<button
  onClick={() => setShowAddModal(true)}
  className="absolute bottom-2 right-8 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200"
>
  <Plus size={24} />
</button>
        </div>
      </div>

      {showAddModal && <Add onClose={() => setShowAddModal(false)} onAdd={addPatient} />}
    </div>
  );
}
