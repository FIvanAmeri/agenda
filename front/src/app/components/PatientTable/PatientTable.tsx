"use client";

import React, { useEffect, useState } from "react";
import { Patient } from "../interfaz/interfaz";
import BotonPago from "../Pago/boton-pago";
import { PacienteParaPago } from "../interfaz/boton-pago";

interface PatientTableProps {
  filteredPatients: Patient[];
  onEditClick: (patient: Patient) => void;
  onDeleteClick: (patientId: number) => void;
}

const PatientTable: React.FC<PatientTableProps> = ({
  filteredPatients,
  onEditClick,
  onDeleteClick,
}) => {
  const [patientsState, setPatientsState] = useState<Patient[]>(filteredPatients);

  useEffect(() => {
    setPatientsState(filteredPatients);
  }, [filteredPatients]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
    const day = String(adjustedDate.getDate()).padStart(2, "0");
    const month = String(adjustedDate.getMonth() + 1).padStart(2, "0");
    const year = adjustedDate.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatTime = (timeString: string) => {
    if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) {
      return timeString;
    }
    const time = new Date(timeString);
    const hours = String(time.getHours()).padStart(2, "0");
    const minutes = String(time.getMinutes()).padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const sortedPatients = [...patientsState].sort((a, b) => b.id - a.id);


  const mapToPago = (p: Patient): PacienteParaPago => ({
    id: p.id,
    estadoPagoActual: p.estadoPago,
    montoPagadoActual: p.montoPagado,
    montoTotalActual: p.montoTotal,
  });


  const handleEstadoActualizado = (pacienteActualizado: PacienteParaPago) => {
    setPatientsState(prev =>
      prev.map(p =>
        p.id === pacienteActualizado.id
          ? { ...p, estadoPago: pacienteActualizado.estadoPagoActual, montoPagado: pacienteActualizado.montoPagadoActual }
          : p
      )
    );
  };

  return (
    <div className="mt-10">
      {sortedPatients.length > 0 ? (
        <ul className="space-y-4">
          {sortedPatients.map((patient, index) => {
            const pagoData = mapToPago(patient);

            return (
              <li
                key={patient.id}
                className="flex items-start justify-between border-b p-4 transition-all duration-300 ease-in-out"
              >
                <div className="flex">
                  <div className="mr-4 mt-1 flex-shrink-0">
                    <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-cyan-600 text-white font-bold text-sm">
                      {index + 1}
                    </span>
                  </div>

                  <div>
                    <div><strong>Paciente:</strong> {patient.paciente}</div>
                    <div><strong>Fecha:</strong> {formatDate(patient.dia)}</div>
                    <div><strong>Hora:</strong> {formatTime(patient.hora)}</div>
                    <div><strong>Prácticas:</strong> {patient.practicas}</div>
                    <div><strong>Obra Social:</strong> {patient.obraSocial}</div>
                    <div><strong>Institución:</strong> {patient.institucion}</div>

                    {(patient.estadoPago === 'parcialmente pagado' || patient.estadoPago === 'pagado') && (
                      <div className="mt-1"> 
                        <strong>Monto Pagado:</strong> {formatCurrency(patient.montoPagado)}
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <button
                        onClick={() => onEditClick(patient)}
                        className="py-2 px-4 bg-emerald-400 text-white rounded-md hover:bg-emerald-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => onDeleteClick(patient.id)}
                        className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm"
                      >
                        Borrar
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <BotonPago
                    paciente={pagoData}
                    onEstadoActualizado={handleEstadoActualizado}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="text-center">No se encontraron pacientes.</div>
      )}
    </div>
  );
};

export default PatientTable;
