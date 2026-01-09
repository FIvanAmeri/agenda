"use client";

import React from "react";
import { Cirugia } from "../../components/interfaz/interfaz";
import { FaEdit, FaTrash, FaUserMd, FaCalendarAlt, FaUser } from "react-icons/fa";
import { formatDateForDisplay } from "../../lib/utils";
import { PagoCell, MedicoPagoDisplay } from "../Cirugia/CirugiaTableComponents";

interface CirugiaTableProps {
    cirugias: Cirugia[];
    onEditClick: (c: Cirugia) => void;
    onDeleteClick: (c: Cirugia) => void;
}
    
const calcularEdad = (fecha: string | null): string => {
    if (!fecha) return "N/A";
    const hoy = new Date();
    const cumple = new Date(fecha);
    let edad = hoy.getFullYear() - cumple.getFullYear();
    const m = hoy.getMonth() - cumple.getMonth();
    if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) edad--;
    return edad >= 0 ? `${edad}a` : "N/A";
};

const CirugiaTable: React.FC<CirugiaTableProps> = ({ cirugias, onEditClick, onDeleteClick }) => {
    const sortedCirugias: Cirugia[] = [...cirugias].sort((a, b) => {
        const dateA = new Date(a.fecha).getTime();
        const dateB = new Date(b.fecha).getTime();
        if (dateB !== dateA) return dateB - dateA;
        return b.id - a.id;
    });

    return (
        <div className="mt-8 w-full space-y-4">
            <div className="hidden md:grid grid-cols-6 gap-4 bg-[#0c4a34] text-white uppercase text-[10px] md:text-xs font-bold p-4 rounded-t-lg text-center items-center shadow-lg">
                <div>N°</div>
                <div>Fecha</div>
                <div>Paciente</div>
                <div>Operó</div>
                <div className="hidden lg:block">Ayud. 1</div>
                <div className="hidden lg:block">Ayud. 2</div>
                <div className="lg:hidden">Ayudantes</div>
            </div>

            <div className="space-y-6">
                {sortedCirugias.map((c, index) => (
                    <div
                        key={c.id}
                        className="group flex flex-col transition-all duration-300 border-2 border-transparent hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] rounded-xl overflow-hidden bg-[#143845]"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-6 gap-4 p-4 items-center text-center text-gray-200">
                            <div className="flex items-center justify-between md:justify-center border-b border-gray-700 md:border-none pb-2 md:pb-0">
                                <span className="md:hidden text-[10px] font-bold uppercase text-gray-400">N° Registro</span>
                                <div className="font-bold text-cyan-400 text-base md:text-lg">
                                    {sortedCirugias.length - index}
                                </div>
                            </div>

                            <div className="flex items-center justify-between md:justify-center border-b border-gray-700 md:border-none pb-2 md:pb-0 text-[11px] md:text-sm whitespace-nowrap">
                                <span className="md:hidden flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400">
                                    <FaCalendarAlt /> Fecha
                                </span>
                                {formatDateForDisplay(c.fecha)}
                            </div>

                            <div className="flex items-center justify-between md:justify-center border-b border-gray-700 md:border-none pb-2 md:pb-0">
                                <span className="md:hidden flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400">
                                    <FaUser /> Paciente
                                </span>
                                <span className="font-bold uppercase leading-tight text-xs md:text-sm text-right md:text-center">
                                    {c.paciente}
                                </span>
                            </div>

                            <div className="flex items-center justify-between md:justify-center border-b border-gray-700 md:border-none pb-2 md:pb-0">
                                <span className="md:hidden flex items-center gap-1 text-[10px] font-bold uppercase text-gray-400">
                                    <FaUserMd /> Operó
                                </span>
                                <div className="flex flex-col items-end md:items-center">
                                    <span className="text-[10px] md:text-xs font-medium truncate max-w-30 md:w-full">
                                        {c.medicoOpero || "-"}
                                    </span>
                                    {c.medicoOpero && (
                                        <MedicoPagoDisplay
                                            montoHonorarios={c.montoTotalHonorarios}
                                            montoPresupuesto={c.montoTotalPresupuesto}
                                            participacion={0.5}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="hidden lg:flex flex-col items-center text-[10px] md:text-xs">
                                <span className="truncate w-full">
                                    {c.medicoAyudo1 || "-"}
                                </span>
                                {c.medicoAyudo1 && (
                                    <MedicoPagoDisplay
                                        montoHonorarios={c.montoTotalHonorarios}
                                        montoPresupuesto={c.montoTotalPresupuesto}
                                        participacion={0.25}
                                    />
                                )}
                            </div>

                            <div className="hidden lg:flex flex-col items-center text-[10px] md:text-xs">
                                <span className="truncate w-full">
                                    {c.medicoAyudo2 || "-"}
                                </span>
                                {c.medicoAyudo2 && (
                                    <MedicoPagoDisplay
                                        montoHonorarios={c.montoTotalHonorarios}
                                        montoPresupuesto={c.montoTotalPresupuesto}
                                        participacion={0.25}
                                    />
                                )}
                            </div>

                            <div className="lg:hidden flex items-center justify-between pt-2 md:pt-0">
                                <span className="md:hidden text-[10px] font-bold uppercase text-gray-400">Ayudantes</span>
                                <div className="flex flex-col text-right md:text-center space-y-2">
                                    {c.medicoAyudo1 && (
                                        <div className="flex flex-col items-end md:items-center">
                                            <span className="text-[10px] truncate">{c.medicoAyudo1}</span>
                                            <MedicoPagoDisplay
                                                montoHonorarios={c.montoTotalHonorarios}
                                                montoPresupuesto={c.montoTotalPresupuesto}
                                                participacion={0.25}
                                            />
                                        </div>
                                    )}
                                    {c.medicoAyudo2 && (
                                        <div className="flex flex-col items-end md:items-center border-t border-gray-700/30 pt-1">
                                            <span className="text-[10px] truncate">{c.medicoAyudo2}</span>
                                            <MedicoPagoDisplay
                                                montoHonorarios={c.montoTotalHonorarios}
                                                montoPresupuesto={c.montoTotalPresupuesto}
                                                participacion={0.25}
                                            />
                                        </div>
                                    )}
                                    {!c.medicoAyudo1 && !c.medicoAyudo2 && <span className="text-[10px]">-</span>}
                                </div>
                            </div>
                        </div>

                        <div className="px-2 md:px-4 pb-4">
                            <div className="flex flex-col space-y-4 p-3 md:p-4 bg-[#1f3b47]/50 rounded-lg border border-gray-700/50 shadow-inner">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                                    <div>
                                        <h4 className="text-[9px] font-black mb-2 uppercase tracking-widest text-gray-400">
                                            Honorarios / Presupuesto
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                                            <PagoCell
                                                total={c.montoTotalHonorarios}
                                                pagado={c.montoPagadoHonorarios}
                                                estado={c.estadoPagoHonorarios}
                                                label="Honorarios"
                                                moneda="USD"
                                            />
                                            <PagoCell
                                                total={c.montoTotalPresupuesto}
                                                pagado={c.montoPagadoPresupuesto}
                                                estado={c.estadoPagoPresupuesto}
                                                label="Presupuesto"
                                                moneda="ARS"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-[9px] font-black mb-2 uppercase tracking-widest text-gray-400">
                                            Información
                                        </h4>
                                        <div className="grid grid-cols-2 gap-2 md:gap-3">
                                            <div className="text-[10px] md:text-[11px] text-yellow-400 p-2 md:p-3 border border-gray-600 bg-[#0F2A35] rounded-lg font-black text-center uppercase tracking-tighter">
                                                {c.obraSocial || "Particular"}
                                            </div>
                                            <div className="text-[10px] md:text-[11px] text-cyan-400 p-2 md:p-3 border border-gray-600 bg-[#0F2A35] rounded-lg font-black text-center">
                                                EDAD: {calcularEdad(c.fechaNacimientoPaciente)}
                                            </div>
                                            <div className="col-span-2 text-[10px] text-cyan-300 p-2 md:p-3 border border-gray-600 bg-[#0F2A35] rounded-lg font-black text-center uppercase tracking-wide">
                                                <div className="text-gray-400 text-[9px] mb-1">Cirugía</div>
                                                {c.tipoCirugia}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="text-[9px] font-black mb-2 uppercase tracking-widest text-gray-400">
                                        Descripción Adicional
                                    </h4>
                                    <div className="text-[10px] md:text-[11px] text-gray-300 p-3 border border-gray-700 rounded-lg bg-[#0F2A35]/50 leading-relaxed italic border-l-4 border-l-cyan-500">
                                        {c.descripcion || "Sin descripción registrada."}
                                    </div>
                                </div>

                                <div className="flex flex-row justify-center md:justify-end items-center gap-3 pt-3 border-t border-gray-700/50">
                                    <button
                                        onClick={() => onEditClick(c)}
                                        className="flex-1 md:flex-none flex items-center justify-center space-x-2 text-cyan-400 hover:bg-cyan-400/10 px-4 md:px-5 py-2.5 border border-cyan-500/30 rounded-lg transition-all text-[9px] md:text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <FaEdit />
                                        <span>Editar</span>
                                    </button>
                                    <button
                                        onClick={() => onDeleteClick(c)}
                                        className="flex-1 md:flex-none flex items-center justify-center space-x-2 text-rose-500 hover:bg-rose-500/10 px-4 md:px-5 py-2.5 border border-rose-500/30 rounded-lg transition-all text-[9px] md:text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <FaTrash />
                                        <span>Borrar</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CirugiaTable;