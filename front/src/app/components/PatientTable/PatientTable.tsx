"use client";

import React, { useCallback } from "react";
import type { Patient } from "../interfaz/interfaz";
import BotonPago from "../Pago/boton-pago";
import type { PacienteParaPago } from "../interfaz/pago-interfaces";

interface PatientTableProps {
    filteredPatients: Patient[];
    onEditClick: (patient: Patient) => void;
    onDeleteClick: (patientId: number) => void;
    setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

const formatDateForDisplay = (isoDate?: string | null): string => {
    if (!isoDate) return "";
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "";
    const localDate = new Date(isoDate.includes('T') ? isoDate : isoDate + 'T00:00:00');
    const localD = localDate.getDate().toString().padStart(2, "0");
    const localM = (localDate.getMonth() + 1).toString().padStart(2, "0");
    const localY = localDate.getFullYear();
    return `${localD}/${localM}/${localY}`;
};

const calcularEdad = (fechaNacimiento: string | null): number | null => {
    if (!fechaNacimiento) return null;
    try {
        const fechaNac = new Date(fechaNacimiento + 'T00:00:00');
        const hoy = new Date();
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();
        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }
        return edad;
    } catch {
        return null;
    }
};

const PatientTable: React.FC<PatientTableProps> = ({
    filteredPatients,
    onEditClick,
    onDeleteClick,
    setPatients,
}) => {
    const formatDate = useCallback((dateString: string) => {
        const date = new Date(dateString);
        const adjustedDate = new Date(date.getTime() + date.getTimezoneOffset() * 60000);
        const day = String(adjustedDate.getDate()).padStart(2, "0");
        const month = String(adjustedDate.getMonth() + 1).padStart(2, "0");
        const year = adjustedDate.getFullYear();
        return `${day}-${month}-${year}`;
    }, []);

    const formatTime = useCallback((timeString: string) => {
        if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(timeString)) return timeString;
        const time = new Date(timeString);
        const hours = String(time.getHours()).padStart(2, "0");
        const minutes = String(time.getMinutes()).padStart(2, "0");
        return `${hours}:${minutes}`;
    }, []);

    const formatCurrency = useCallback((amount: number | string): string => {
        const numericAmount = Number(amount);
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericAmount);
    }, []);

    const mapToPago = useCallback((p: Patient): PacienteParaPago => ({
        id: p.id,
        estadoPagoActual: p.estadoPago,
        montoPagadoActual: p.montoPagado,
        montoTotalActual: p.montoTotal,
        fechaPagoParcial: p.fechaPagoParcial ?? null,
        fechaPagoTotal: p.fechaPagoTotal ?? null,
        ultimoPagoParcial: p.ultimoPagoParcial,
        ultimoPagoTotal: p.ultimoPagoTotal,
    }), []);

    const handleEstadoActualizado = useCallback((pacienteActualizado: PacienteParaPago) => {
        setPatients(prev =>
            prev.map(p => {
                if (p.id !== pacienteActualizado.id) return p;
                return {
                    ...p,
                    estadoPago: pacienteActualizado.estadoPagoActual,
                    montoPagado: pacienteActualizado.montoPagadoActual,
                    montoTotal: pacienteActualizado.montoTotalActual,
                    fechaPagoParcial: pacienteActualizado.fechaPagoParcial || null,
                    fechaPagoTotal: pacienteActualizado.fechaPagoTotal || null,
                    ultimoPagoParcial: pacienteActualizado.ultimoPagoParcial,
                    ultimoPagoTotal: pacienteActualizado.ultimoPagoTotal,
                };
            })
        );
    }, [setPatients]);

    return (
        <div className="mt-10">
            {filteredPatients.length > 0 ? (
                <ul className="space-y-4">
                    {filteredPatients.map((patient, index) => {
                        const pagoData = mapToPago(patient);
                        const fechaParcialFormateada = formatDateForDisplay(patient.fechaPagoParcial);
                        const fechaTotalFormateada = formatDateForDisplay(patient.fechaPagoTotal);
                        const edad = calcularEdad(patient.fechaNacimiento);

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
                                        {edad !== null && (
                                            <div><strong>Edad:</strong> {edad} años</div>
                                        )}
                                        <div><strong>Fecha:</strong> {formatDate(patient.dia)}</div>
                                        <div><strong>Hora:</strong> {formatTime(patient.hora)}</div>
                                        <div><strong>Prácticas:</strong> {patient.practicas}</div>
                                        <div><strong>Obra Social:</strong> {patient.obraSocial}</div>
                                        <div><strong>Institución:</strong> {patient.institucion}</div>

                                        {patient.estadoPago !== 'no pagado' && (
                                            <div>
                                                <strong>Monto Pagado:</strong> {formatCurrency(patient.montoPagado)}
                                            </div>
                                        )}

                                        <div className="mt-4 flex gap-2">
                                            <button
                                                onClick={() => onEditClick(patient)}
                                                className="py-2 px-4 bg-emerald-400 text-white rounded-md hover:bg-emerald-600 text-sm"
                                            >
                                                Editar
                                            </button>

                                            <button
                                                onClick={() => onDeleteClick(patient.id)}
                                                className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
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