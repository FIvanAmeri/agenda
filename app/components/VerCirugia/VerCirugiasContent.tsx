"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User, Cirugia } from "../../components/interfaz/interfaz";
import FiltroCirugiaForm from "../../components/Cirugia/FiltroCirugiaForm";
import { FiltrosCirugia } from "../../components/interfaz/tipos-cirugia";
import { FaEdit, FaTrash } from "react-icons/fa";
import CirugiaDetailModal from "../../components/Cirugia/CirugiaDetailModal";
import ConfirmDeleteModal from "../../components/Cirugia/ConfirmDeleteModal";
import { formatDateForDisplay } from "../../lib/utils";
import { useCirugias } from "../../hooks/Cirugia/useCirugiaData";
import { PagoCell, MedicoPagoDisplay } from "../Cirugia/CirugiaTableComponents";

interface Props {
    user: User;
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

interface CirugiaTableProps {
    cirugias: Cirugia[];
    onEditClick: (c: Cirugia) => void;
    onDeleteClick: (c: Cirugia) => void;
}

const CirugiaTable: React.FC<CirugiaTableProps> = ({ cirugias, onEditClick, onDeleteClick }) => {
    const sortedCirugias: Cirugia[] = [...cirugias].sort((a, b) => {
        const dateA = new Date(a.fecha).getTime();
        const dateB = new Date(b.fecha).getTime();
        if (dateB !== dateA) return dateB - dateA;
        return b.id - a.id;
    });

    return (
        <div className="mt-8 w-full space-y-4">
            <div className="grid grid-cols-6 gap-4 bg-[#0c4a34] text-white uppercase text-[10px] md:text-xs font-bold p-4 rounded-t-lg text-center items-center shadow-lg">
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
                        <div className="grid grid-cols-6 gap-4 p-4 items-center text-center text-gray-200">
                            <div className="font-bold text-cyan-400 text-base md:text-lg">
                                {sortedCirugias.length - index}
                            </div>
                            <div className="text-[10px] md:text-sm whitespace-nowrap">
                                {formatDateForDisplay(c.fecha)}
                            </div>
                            <div className="flex items-center justify-center">
                                <span className="font-bold uppercase leading-tight text-xs md:text-sm text-center">
                                    {c.paciente}
                                </span>
                            </div>
                            <div className="flex flex-col items-center">
                                <span className="text-[10px] md:text-xs font-medium truncate w-full">
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
                            <div className="hidden lg:flex flex-col items-center">
                                <span className="text-[10px] md:text-xs truncate w-full">
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
                            <div className="hidden lg:flex flex-col items-center">
                                <span className="text-[10px] md:text-xs truncate w-full">
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
                        </div>

                        <div className="px-4 pb-4">
                            <div className="flex flex-col space-y-4 p-4 bg-[#1f3b47]/50 rounded-lg border border-gray-700/50 shadow-inner">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-[9px] font-black mb-2 uppercase tracking-widest text-gray-400">
                                            Honorarios / Presupuesto
                                        </h4>
                                        <div className="grid grid-cols-2 gap-3">
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
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="text-[11px] text-yellow-400 p-3 border border-gray-600 bg-[#0F2A35] rounded-lg font-black text-center uppercase tracking-tighter">
                                                {c.obraSocial || "Particular"}
                                            </div>
                                            <div className="text-[11px] text-cyan-400 p-3 border border-gray-600 bg-[#0F2A35] rounded-lg font-black text-center">
                                                EDAD: {calcularEdad(c.fechaNacimientoPaciente)}
                                            </div>
                                            <div className="col-span-2 text-[10px] text-cyan-300 p-3 border border-gray-600 bg-[#0F2A35] rounded-lg font-black text-center uppercase tracking-wide">
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
                                    <div className="text-[11px] text-gray-300 p-3 border border-gray-700 rounded-lg bg-[#0F2A35]/50 leading-relaxed italic border-l-4 border-l-cyan-500">
                                        {c.descripcion || "Sin descripción registrada."}
                                    </div>
                                </div>

                                <div className="flex justify-end items-center space-x-3 pt-3 border-t border-gray-700/50">
                                    <button
                                        onClick={() => onEditClick(c)}
                                        className="flex items-center space-x-2 text-cyan-400 hover:bg-cyan-400/10 px-5 py-2.5 border border-cyan-500/30 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <FaEdit />
                                        <span>Editar</span>
                                    </button>
                                    <button
                                        onClick={() => onDeleteClick(c)}
                                        className="flex items-center space-x-2 text-rose-500 hover:bg-rose-500/10 px-5 py-2.5 border border-rose-500/30 rounded-lg transition-all text-[10px] font-black uppercase tracking-widest"
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

export default function VerCirugiasContent({ user }: Props) {
    const router = useRouter();
    const [fetchTrigger, setFetchTrigger] = useState<number>(0);
    const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedCirugia, setSelectedCirugia] = useState<Cirugia | null>(null);
    const [deleteCirugia, setDeleteCirugia] = useState<{ id: number | null; patientName: string }>({
        id: null,
        patientName: "",
    });
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

    const [filters, setFilters] = useState<FiltrosCirugia>({
        dateFrom: "",
        dateTo: "",
        selectedPatientName: "",
        selectedTipoCirugia: "",
        selectedMedico: "",
        selectedStatus: "",
        selectedObraSocial: "",
    });

    const { allCirugias, loading, options } = useCirugias(user, filters, fetchTrigger);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!user?.id || !token) router.push("/");
    }, [user, router]);

    const filteredCirugias = useMemo(() => {
        return allCirugias.filter(c => {
            const matchPaciente =
                filters.selectedPatientName === "" ||
                c.paciente.toLowerCase().includes(filters.selectedPatientName.toLowerCase());
            const matchTipo =
                filters.selectedTipoCirugia === "" ||
                c.tipoCirugia.toLowerCase().includes(filters.selectedTipoCirugia.toLowerCase());
            const matchMedico =
                filters.selectedMedico === "" ||
                c.medicoOpero?.toLowerCase().includes(filters.selectedMedico.toLowerCase());
            const matchOS =
                filters.selectedObraSocial === "" ||
                c.obraSocial?.toLowerCase().includes(filters.selectedObraSocial.toLowerCase());
            const matchStatus =
                filters.selectedStatus === "" || c.estadoPagoHonorarios === filters.selectedStatus;
            return matchPaciente && matchTipo && matchMedico && matchOS && matchStatus;
        });
    }, [allCirugias, filters]);

    const handleEditSubmit = async (cirugiaId: number, updatePayload: Partial<Cirugia>) => {
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/cirugias/${cirugiaId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...updatePayload, usuarioId: user.id }),
            });
            if (res.ok) {
                setNotification({ message: "Actualizado con éxito.", type: "success" });
                setIsEditModalOpen(false);
                setFetchTrigger(p => p + 1);
            }
        } catch {
            setNotification({ message: "Error al actualizar.", type: "error" });
        }
    };

    const confirmDelete = async () => {
        if (!deleteCirugia.id) return;
        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/cirugias/${deleteCirugia.id}?usuarioId=${user.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (res.status === 204) {
                setNotification({ message: "Eliminado con éxito.", type: "success" });
                setFetchTrigger(p => p + 1);
            }
        } catch {
            setNotification({ message: "Error al intentar eliminar.", type: "error" });
        } finally {
            setIsConfirmModalOpen(false);
        }
    };

    if (!user?.id) return <div />;

    return (
        <div className="w-full max-w-full overflow-x-hidden p-3 md:p-6 bg-[#0B1E26] min-h-screen">
            <h1 className="text-2xl md:text-4xl font-black mb-8 text-white tracking-tighter italic border-l-8 border-cyan-500 pl-4">
                GESTIÓN DE CIRUGÍAS
            </h1>

            {notification && (
                <div
                    className={`p-4 mb-6 rounded-xl flex justify-between items-center shadow-2xl ${
                        notification.type === "success" ? "bg-emerald-600" : "bg-rose-600"
                    }`}
                >
                    <p className="font-bold text-white uppercase text-xs md:text-sm">
                        {notification.message}
                    </p>
                    <button onClick={() => setNotification(null)} className="text-white font-black text-xl">
                        ×
                    </button>
                </div>
            )}

            <FiltroCirugiaForm
                filters={filters}
                setFilters={setFilters}
                cirugias={filteredCirugias}
                medicosOpciones={options.medicos}
                tiposCirugiaOpciones={options.tipos}
                obrasSocialesOpciones={options.obrasSociales}
                onCirugiaAdded={() => setFetchTrigger(p => p + 1)}
            />

            {loading && allCirugias.length === 0 ? (
                <div className="text-center py-20 text-cyan-400 font-black animate-pulse uppercase tracking-widest">
                    Sincronizando Base de Datos...
                </div>
            ) : filteredCirugias.length === 0 ? (
                <div className="text-center py-20 text-rose-400 font-black uppercase border-2 border-dashed border-gray-800 rounded-2xl mt-8">
                    No se encontraron registros.
                </div>
            ) : (
                <CirugiaTable
                    cirugias={filteredCirugias}
                    onEditClick={c => {
                        setSelectedCirugia(c);
                        setIsEditModalOpen(true);
                    }}
                    onDeleteClick={c => {
                        setDeleteCirugia({ id: c.id, patientName: c.paciente });
                        setIsConfirmModalOpen(true);
                    }}
                />
            )}

            {isEditModalOpen && selectedCirugia && (
                <CirugiaDetailModal
                    cirugia={selectedCirugia}
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleEditSubmit}
                    medicosOpciones={options.medicos}
                    tiposCirugiaOpciones={options.tipos}
                    obrasSocialesOpciones={options.obrasSociales}
                    showHonorarios={true}
                />
            )}

            <ConfirmDeleteModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={confirmDelete}
                patientName={deleteCirugia.patientName}
                cirugiaId={deleteCirugia.id || 0}
            />
        </div>
    );
}
