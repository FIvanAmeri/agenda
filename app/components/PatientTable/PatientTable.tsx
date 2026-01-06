"use client";

import React, { useCallback, useState, useMemo } from "react";
import type { Patient } from "../interfaz/interfaz";
import BotonPago from "../Pago/boton-pago";
import type { PacienteParaPago } from "../interfaz/pago-interfaces";
import { FaTimes } from "react-icons/fa";

interface PatientTableProps {
    filteredPatients: Patient[];
    onEditClick: (patient: Patient) => void;
    onDeleteClick: (patientId: number) => void;
    setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

const formatDateForDisplay = (isoDate?: string | null): string => {
    if (!isoDate) return "";
    const pureDate = isoDate.split('T')[0];
    const [year, month, day] = pureDate.split('-');
    return `${day}/${month}/${year}`;
};

const calcularEdad = (fechaNacimiento: string | null): number | null => {
    if (!fechaNacimiento) return null;
    const fechaNac = new Date(fechaNacimiento + 'T00:00:00');
    if (isNaN(fechaNac.getTime())) return null;
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
        edad--;
    }
    return edad;
};

const PatientTable: React.FC<PatientTableProps> = ({
    filteredPatients,
    onEditClick,
    onDeleteClick,
    setPatients,
}) => {
    const [selectedPatientGroup, setSelectedPatientGroup] = useState<Patient[] | null>(null);

    const formatDate = useCallback((dateString: string) => {
        const pureDate = dateString.split('T')[0];
        const [year, month, day] = pureDate.split('-');
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
        
        if (selectedPatientGroup) {
            setSelectedPatientGroup(prev => 
                prev ? prev.map(p => p.id === pacienteActualizado.id ? {
                    ...p,
                    estadoPago: pacienteActualizado.estadoPagoActual,
                    montoPagado: pacienteActualizado.montoPagadoActual,
                    montoTotal: pacienteActualizado.montoTotalActual,
                    fechaPagoParcial: pacienteActualizado.fechaPagoParcial || null,
                    fechaPagoTotal: pacienteActualizado.fechaPagoTotal || null,
                    ultimoPagoParcial: pacienteActualizado.ultimoPagoParcial,
                    ultimoPagoTotal: pacienteActualizado.ultimoPagoTotal,
                } : p) : null
            );
        }
    }, [setPatients, selectedPatientGroup]);

    const sortedPatients = useMemo(() => {
        return [...filteredPatients].sort((a, b) => b.id - a.id);
    }, [filteredPatients]);

    const groupedPatients = useMemo(() => {
        const groups: Record<string, Patient[]> = {};
        const order: string[] = [];
        sortedPatients.forEach(patient => {
            if (!groups[patient.paciente]) {
                groups[patient.paciente] = [];
                order.push(patient.paciente);
            }
            groups[patient.paciente].push(patient);
        });
        return { groups, order };
    }, [sortedPatients]);

    const getGroupStatusClasses = (patients: Patient[]) => {
        const allPagado = patients.every(p => p.estadoPago === "pagado");
        const anyParcial = patients.some(p => p.estadoPago === "parcialmente pagado");
        if (allPagado) return "bg-emerald-900/40 border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:border-emerald-400";
        if (anyParcial) return "bg-yellow-900/30 border-yellow-500/50 hover:shadow-[0_0_20px_rgba(234,179,8,0.3)] hover:border-yellow-400";
        return "bg-cyan-900/30 border-cyan-700/60 hover:shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:border-cyan-500";
    };

    const getItemStatusClasses = (estado: string) => {
        if (estado === "pagado") return "border-emerald-500 bg-emerald-950/30 hover:shadow-[inset_0_0_15px_rgba(16,185,129,0.2)]";
        if (estado === "parcialmente pagado") return "border-yellow-500 bg-yellow-950/20 hover:shadow-[inset_0_0_15px_rgba(234,179,8,0.2)]";
        return "border-cyan-800/60 bg-cyan-950/40 hover:shadow-[inset_0_0_15px_rgba(6,182,212,0.2)]";
    };

    return (
        <div className="mt-6 md:mt-10 px-2 md:px-0">
            {groupedPatients.order.length > 0 ? (
                <ul className="space-y-4">
                    {groupedPatients.order.map((patientName, index) => {
                        const patients = groupedPatients.groups[patientName];
                        const tieneFechaNacimiento = !!patients[0].fechaNacimiento;
                        return (
                            <li
                                key={patientName}
                                className={`flex flex-col md:flex-row items-center justify-between border-2 p-4 rounded-lg transition-all duration-300 hover:scale-[1.01] cursor-pointer ${getGroupStatusClasses(patients)}`}
                                onClick={() => setSelectedPatientGroup(patients)}
                            >
                                <div className="flex items-center w-full">
                                    <span className="mr-4 inline-flex items-center justify-center h-8 w-8 rounded-full bg-cyan-600 text-white font-bold text-sm">
                                        {index + 1}
                                    </span>
                                    <div className="text-lg font-bold text-white transition-colors text-left flex items-center gap-2">
                                        {patientName} 
                                        {tieneFechaNacimiento && (
                                            <span className="text-xs font-normal text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/40">
                                                (Paciente)
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <div className="text-center py-10 text-gray-400">No se encontraron pacientes.</div>
            )}

            {selectedPatientGroup && (
                <div className="fixed inset-0 z-9999 flex items-center justify-center p-0 md:p-4 bg-black/80 backdrop-blur-md">
                    <div className="bg-[#0F2A35] w-full h-full md:h-auto md:max-h-[85vh] md:max-w-4xl flex flex-col md:rounded-xl border-0 md:border-2 md:border-cyan-600 shadow-2xl overflow-hidden">
                        <div className="p-4 border-b border-cyan-700 flex justify-between items-center bg-cyan-900/50 shrink-0">
                            <div className="flex flex-col">
                                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide truncate">{selectedPatientGroup[0].paciente}</h2>
                                <span className="text-[10px] sm:text-xs text-cyan-400 font-semibold mt-0.5">
                                    {selectedPatientGroup[0].fechaNacimiento 
                                        ? `Edad: ${calcularEdad(selectedPatientGroup[0].fechaNacimiento)} años` 
                                        : "No hay fecha de nacimiento"}
                                </span>
                            </div>
                            <button onClick={() => setSelectedPatientGroup(null)} className="text-white hover:text-red-400 transition-colors p-2 cursor-pointer">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-linear-to-b from-[#0F2A35] to-[#0a1d25] custom-scrollbar">
                            {[...selectedPatientGroup].sort((a, b) => b.id - a.id).map((patient) => {
                                const pagoData = mapToPago(patient);
                                const fechaParcialFormateada = formatDateForDisplay(patient.fechaPagoParcial);
                                const fechaTotalFormateada = formatDateForDisplay(patient.fechaPagoTotal);

                                return (
                                    <div 
                                        key={patient.id} 
                                        className={`p-4 rounded-lg border-2 transition-all duration-300 flex flex-col lg:flex-row justify-between gap-4 ${getItemStatusClasses(patient.estadoPago)}`}
                                    >
                                        <div className="flex-1 space-y-2 text-gray-200">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-4 text-xs sm:text-sm">
                                                <div><strong className="text-cyan-400/80">Fecha:</strong> {formatDate(patient.dia)}</div>
                                                <div><strong className="text-cyan-400/80">Hora:</strong> {formatTime(patient.hora)}</div>
                                                <div><strong className="text-cyan-400/80">Obra Social:</strong> {patient.obraSocial}</div>
                                                <div><strong className="text-cyan-400/80">Institución:</strong> {patient.institucion}</div>
                                            </div>
                                            <div className="pt-2 border-t border-cyan-800/40 text-xs sm:text-sm">
                                                <strong className="text-cyan-400/80">Prácticas:</strong> <span className="text-white">{patient.practicas}</span>
                                            </div>

                                            {patient.estadoPago !== 'no pagado' && (
                                                <div className="mt-2 p-2 bg-black/40 rounded border border-cyan-700/40 text-[10px] sm:text-xs">
                                                    <div><strong className="text-emerald-400/90">Monto Pagado:</strong> {formatCurrency(patient.montoPagado)}</div>
                                                    {patient.estadoPago === 'parcialmente pagado' && fechaParcialFormateada && (
                                                        <div><strong className="text-yellow-400/90">Fecha Pago Parcial:</strong> {fechaParcialFormateada}</div>
                                                    )}
                                                    {patient.estadoPago === 'pagado' && fechaTotalFormateada && (
                                                        <div><strong className="text-emerald-400/90">Fecha Pago Total:</strong> {fechaTotalFormateada}</div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="flex gap-2 pt-2">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onEditClick(patient);
                                                    }}
                                                    className="px-4 py-2 bg-emerald-600 text-white rounded font-bold text-[10px] hover:bg-emerald-500 transition-all uppercase tracking-wider cursor-pointer"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        onDeleteClick(patient.id);
                                                        const updatedGroup = selectedPatientGroup.filter(p => p.id !== patient.id);
                                                        setSelectedPatientGroup(updatedGroup.length > 0 ? updatedGroup : null);
                                                    }}
                                                    className="px-4 py-2 bg-red-600 text-white rounded font-bold text-[10px] hover:bg-red-500 transition-all uppercase tracking-wider cursor-pointer"
                                                >
                                                    Borrar
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-center bg-cyan-950/40 p-3 rounded-lg min-w-full lg:min-w-45 border border-cyan-600/30">
                                            <BotonPago
                                                paciente={pagoData}
                                                onEstadoActualizado={handleEstadoActualizado}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientTable;