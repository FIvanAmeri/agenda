"use client"
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import Add from "../Add/page";
import Patient from "../interfaz";

export default function Principal() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
      if (storedUser?.usuario) {
        const formattedUser = storedUser.usuario.trim();
        if (formattedUser) {
          const userName = formattedUser.charAt(0).toUpperCase() + formattedUser.slice(1);
          setUser(userName);
        }
      }
    } else {
      router.push("/");
    }

    const fetchPatients = async () => {
      try {
        const response = await fetch("http://localhost:3001/api/pacientes");
        const data = await response.json();
        setPatients(data);
      } catch (error) {
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

  return (
    <div className="min-h-screen flex flex-col relative">
      <h1 className="text-2xl font-bold mt-10 mb-6 text-center">
        Espero que estés teniendo un lindo día, {user}
      </h1>

      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Salir
      </button>

      <div className="w-full px-10">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md transition-all duration-300 relative">
          {loading ? (
            <div className="text-center text-lg text-gray-500">Cargando pacientes...</div>
          ) : (
            <table className="w-full text-left table-auto">
              <thead>
                <tr>
                  <th className="px-4 py-2 font-bold text-black">Día</th>
                  <th className="px-4 py-2 font-bold text-black">Paciente</th>
                  <th className="px-4 py-2 font-bold text-black">Prácticas</th>
                  <th className="px-4 py-2 font-bold text-black">Obra Social</th>
                </tr>
              </thead>
              <tbody>
                {patients.length > 0 ? (
                  patients.map((patient, index) => (
                    <tr key={index}>
                      <td className="px-4 py-2">{patient.dia}</td>
                      <td className="px-4 py-2">{patient.paciente}</td>
                      <td className="px-4 py-2">{patient.practicas}</td>
                      <td className="px-4 py-2">{patient.obraSocial}</td>
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
            className="absolute bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      {showAddModal && <Add onClose={() => setShowAddModal(false)} />}
    </div>
  );
}
