"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import Add from "../Add/page";
import { format } from "date-fns";
import * as XLSX from "xlsx";


interface Patient {
  id: string;
  dia: string;
  paciente: string;
  practicas: string;
  obraSocial: string;
  institucion: string;
}

export default function Principal() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");
  const [selectedPractice, setSelectedPractice] = useState<string>("");
  const [selectedObraSocial, setSelectedObraSocial] = useState<string>("");
  const [selectedInstitucion, setSelectedInstitucion] = useState<string>("");

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

  const updatePatient = async (updatedPatient: Patient) => {
    try {
      const response = await fetch(`http://localhost:3001/api/paciente/${updatedPatient.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPatient),
      });

      if (!response.ok) {
        throw new Error("No se pudo actualizar el paciente");
      }
      setPatients((prevPatients) =>
        prevPatients.map((patient) =>
          patient.id === updatedPatient.id ? updatedPatient : patient
        )
      );

      setShowEditModal(false);
    } catch (error) {
      console.error("Error al actualizar paciente:", error);
      setError("Hubo un error al actualizar el paciente");
    }
  };

  const filteredPatients = patients.filter((patient) => {
    return (
      (selectedDate ? format(new Date(patient.dia), "yyyy-MM-dd") === selectedDate : true) &&
      (selectedPatientName ? patient.paciente.toLowerCase().includes(selectedPatientName.toLowerCase()) : true) &&
      (selectedPractice ? patient.practicas.toLowerCase().includes(selectedPractice.toLowerCase()) : true) &&
      (selectedObraSocial ? patient.obraSocial.toLowerCase().includes(selectedObraSocial.toLowerCase()) : true) &&
      (selectedInstitucion ? patient.institucion.toLowerCase().includes(selectedInstitucion.toLowerCase()) : true)
    );
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? format(date, "dd/MM/yyyy") : dateString;
  };

  const handleEditClick = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowEditModal(true);
  };

  const handleExcelUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        if (arrayBuffer) {
          const byteArray = new Uint8Array(arrayBuffer);
          const binaryStr = new TextDecoder().decode(byteArray);
          const workbook = XLSX.read(binaryStr, { type: "binary" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
          const patientsData: Patient[] = excelData.slice(1).map((row: any) => ({
            id: row[0],
            dia: row[1],
            paciente: row[2],
            practicas: row[3],
            obraSocial: row[4],
            institucion: row[5],
          }));
          setPatients(patientsData);
        }
      };
      reader.readAsArrayBuffer(file);
    }
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


      <button
  onClick={() => document.getElementById('fileInput')?.click()}
  className="absolute top-6 right-20 sm:top-6 sm:right-24 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
>
  Excel
</button>
<input
  id="fileInput"
  type="file"
  accept=".xlsx,.xls"
  onChange={handleExcelUpload}
  className="hidden"
/>



      <div className="w-full px-10">
        <div className="bg-gray-100 p-4 rounded-lg shadow-md transition-all duration-300 relative">
          <div className="mb-4 flex gap-4">
            <div className="w-1/4">
              <label htmlFor="date" className="text-black font-bold">Selecciona una fecha:</label>
              <input
                id="date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-2 p-2 border rounded text-black w-full"
              />
            </div>
            <div className="w-1/4">
              <label htmlFor="paciente" className="text-black font-bold">Paciente:</label>
              <select
                id="paciente"
                value={selectedPatientName}
                onChange={(e) => setSelectedPatientName(e.target.value)}
                className="mt-2 p-2 border rounded text-black w-full"
              >
                <option value="">Selecciona Paciente</option>
                {Array.from(new Set(patients.map((patient) => patient.paciente))).map((patientName, index) => (
                  <option key={index} value={patientName}>
                    {patientName}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/4">
              <label htmlFor="practicas" className="text-black font-bold">Prácticas:</label>
              <select
                id="practicas"
                value={selectedPractice}
                onChange={(e) => setSelectedPractice(e.target.value)}
                className="mt-2 p-2 border rounded text-black w-full"
              >
                <option value="">Selecciona Práctica</option>
                {Array.from(new Set(patients.map((patient) => patient.practicas))).map((practice, index) => (
                  <option key={index} value={practice}>
                    {practice}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/4">
              <label htmlFor="obraSocial" className="text-black font-bold">Obra Social:</label>
              <select
                id="obraSocial"
                value={selectedObraSocial}
                onChange={(e) => setSelectedObraSocial(e.target.value)}
                className="mt-2 p-2 border rounded text-black w-full"
              >
                <option value="">Selecciona Obra social</option>
                {Array.from(new Set(patients.map((patient) => patient.obraSocial))).map((obraSocial, index) => (
                  <option key={index} value={obraSocial}>
                    {obraSocial}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-1/4">
              <label htmlFor="institucion" className="text-black font-bold">Institución:</label>
              <select
                id="institucion"
                value={selectedInstitucion}
                onChange={(e) => setSelectedInstitucion(e.target.value)}
                className="mt-2 p-2 border rounded text-black w-full"
              >
                <option value="">Selecciona Institución</option>
                {Array.from(new Set(patients.map((patient) => patient.institucion))).map((institucion, index) => (
                  <option key={index} value={institucion}>
                    {institucion}
                  </option>
                ))}
              </select>
            </div>
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
                  <th className="px-4 py-2 font-bold text-black">Institución</th>
                  <th className="px-4 py-2 font-bold text-black">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.length > 0 ? (
                  filteredPatients.map((patient, index) => (
                    <tr key={index} className="border-b border-gray-300 hover:bg-gray-50">
                      <td className="px-4 py-2 text-black">{formatDate(patient.dia)}</td>
                      <td className="px-4 py-2 text-black">{patient.paciente}</td>
                      <td className="px-4 py-2 text-black">{patient.practicas}</td>
                      <td className="px-4 py-2 text-black">{patient.obraSocial}</td>
                      <td className="px-4 py-2 text-black">{patient.institucion}</td>
                      <td className="px-4 py-2 text-black">
                        <button onClick={() => handleEditClick(patient)} className="text-blue-500 hover:text-blue-700">
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-4 py-2 text-center text-black font-bold">
                      No hay pacientes disponibles
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}

          <button
            onClick={() => setShowAddModal(true)}
            className="fixed bottom-10 right-4 sm:bottom-12 sm:right-6 p-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-200 z-10"
          >
            <Plus size={24} />
          </button>

        </div>
      </div>

      {showAddModal && <Add onClose={() => setShowAddModal(false)} onAdd={addPatient} />}

      {showEditModal && selectedPatient && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96">
            <h2 className="text-xl mb-4 text-center text-black">Editar Paciente</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (selectedPatient) {
                  updatePatient(selectedPatient);
                }
              }}
            >
              <div>
                <label htmlFor="paciente" className="block text-gray-700 font-semibold">
                  Paciente
                </label>
                <input
                  id="paciente"
                  type="text"
                  value={selectedPatient.paciente || ""}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      paciente: e.target.value,
                    })
                  }
                  className="mt-2 p-2 border border-gray-300 rounded w-full text-black"
                />
              </div>
              <div>
                <label htmlFor="practicas" className="block text-gray-700 font-semibold">
                  Prácticas
                </label>
                <input
                  id="practicas"
                  type="text"
                  value={selectedPatient.practicas || ""}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      practicas: e.target.value,
                    })
                  }
                  className="mt-2 p-2 border border-gray-300 rounded w-full text-black"
                />
              </div>
              <div>
                <label htmlFor="obraSocial" className="block text-gray-700 font-semibold">
                  Obra Social
                </label>
                <input
                  id="obraSocial"
                  type="text"
                  value={selectedPatient.obraSocial || ""}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      obraSocial: e.target.value,
                    })
                  }
                  className="mt-2 p-2 border border-gray-300 rounded w-full text-black"
                />
              </div>
              <div>
                <label htmlFor="institucion" className="block text-gray-700 font-semibold">
                  Institución
                </label>
                <input
                  id="institucion"
                  type="text"
                  value={selectedPatient.institucion || ""}
                  onChange={(e) =>
                    setSelectedPatient({
                      ...selectedPatient,
                      institucion: e.target.value,
                    })
                  }
                  className="mt-2 p-2 border border-gray-300 rounded w-full text-black"
                />
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
