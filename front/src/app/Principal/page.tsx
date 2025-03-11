"use client"

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import Patient from "../interfaz";
import AddPatientModal from '../components/Modals/AddPatientModal';
import EditPatientModal from '../components/Modals/EditPatientModal';
import FilterForm from "../components/FilterForm/FilterForm";

export default function Principal() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");
  const [selectedPractice, setSelectedPractice] = useState<string>("");
  const [selectedObraSocial, setSelectedObraSocial] = useState<string>("");
  const [selectedInstitucion, setSelectedInstitucion] = useState<string>("");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

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
        const data = await response.json();
        setPatients(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : "Error desconocido");
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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? format(date, "dd/MM/yyyy") : dateString;
  };

  const addPatient = (newPatient: Patient) => {
    setPatients((prev) => [...prev, newPatient]);
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients((prev) =>
      prev.map((patient) => (patient.id === updatedPatient.id ? updatedPatient : patient))
    );
  };

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setTimeout(() => setShowEditModal(true), 0);
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

  return (
    <div className="min-h-screen flex flex-col relative bg-cyan-900">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-10 mb-6 text-center">
        Espero que estés teniendo un lindo día, {user}
      </h1>

      <button
        onClick={handleLogout}
        className="absolute top-6 right-4 sm:top-6 sm:right-6 py-2 px-4 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
      >
        Salir
      </button>

      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => setShowAddModal(true)}
          className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full sm:w-auto"
        >
          Agregar Paciente
        </button>
      </div>

      <FilterForm
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedPatientName={selectedPatientName}
        setSelectedPatientName={setSelectedPatientName}
        selectedPractice={selectedPractice}
        setSelectedPractice={setSelectedPractice}
        selectedObraSocial={selectedObraSocial}
        setSelectedObraSocial={setSelectedObraSocial}
        selectedInstitucion={selectedInstitucion}
        setSelectedInstitucion={setSelectedInstitucion}
        patients={patients}
      />

      {error && <div className="text-red-500 text-center mt-4">{error}</div>}

      <div className="mt-10">
        {loading ? (
          <div className="text-center">Cargando pacientes...</div>
        ) : filteredPatients.length > 0 ? (
          <ul>
            {filteredPatients.map((patient) => (
              <li key={patient.id} className="border-b p-4 transition-all duration-300 ease-in-out transform scale-95 hover:scale-100 ">
                <div><strong>Paciente:</strong> {patient.paciente}</div>
                <div><strong>Fecha:</strong> {formatDate(patient.dia)}</div>
                <div><strong>Prácticas:</strong> {patient.practicas}</div>
                <div><strong>Obra Social:</strong> {patient.obraSocial}</div>
                <div><strong>Institución:</strong> {patient.institucion}</div>
                <button
                  onClick={() => handleEditPatient(patient)}
                  className="py-2 px-4 bg-emerald-400 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-4"
                >
                  Editar Paciente
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center">No se encontraron pacientes.</div>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <AddPatientModal
            onClose={() => setShowAddModal(false)}
            onAdd={addPatient}
          />
        </div>
      )}

      {showEditModal && selectedPatient && (
        <EditPatientModal
          selectedPatient={selectedPatient}
          updatePatient={updatePatient}
          setShowEditModal={setShowEditModal}
        />
      )}
    </div>
  );
}
