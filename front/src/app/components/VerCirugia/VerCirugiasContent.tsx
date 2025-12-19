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

interface CirugiaTableProps {
    cirugias: Cirugia[];
    onEditClick: (c: Cirugia) => void;
    onDeleteClick: (c: Cirugia) => void;
}

const CirugiaTable: React.FC<CirugiaTableProps> = ({ cirugias, onEditClick, onDeleteClick }) => {
    const sortedCirugias: Cirugia[] = [...cirugias].sort((a: Cirugia, b: Cirugia): number => {
        const dateA: number = new Date(a.fecha).getTime();
        const dateB: number = new Date(b.fecha).getTime();
        if (dateB !== dateA) return dateB - dateA;
        return b.id - a.id;
    });

    return (
        <div className="mt-8 w-full rounded-lg overflow-hidden border border-[#1f3b47]">
            <table className="w-full table-fixed bg-[#0F2A35] border-separate border-spacing-y-4 px-2 md:px-4">
                <thead className="bg-[#0c4a34] text-white uppercase text-[9px] md:text-xs tracking-wider">
                    <tr>
                        <th className="py-3 px-2 text-left w-[10%]">N°</th>
                        <th className="py-3 px-2 text-left w-[20%]">Fecha</th>
                        <th className="py-3 px-2 text-left w-[35%]">Paciente</th>
                        <th className="py-3 px-2 text-left w-[20%]">Operó</th>
                        <th className="py-3 px-2 text-left hidden lg:table-cell w-[15%]">Ayud. 1</th>
                        <th className="py-3 px-2 text-left hidden lg:table-cell w-[15%]">Ayud. 2</th>
                        <th className="py-3 px-1 w-[15%] lg:w-[10%]"></th>
                    </tr>
                </thead>
                <tbody className="text-gray-200 text-xs md:text-sm">
                    {sortedCirugias.map((c: Cirugia, index: number): JSX.Element => (
                        <React.Fragment key={c.id}>
                            <tr className="group">
                                <td colSpan={7} className="p-0">
                                    <div className="flex flex-col mb-4 transition-all duration-300 border-2 border-transparent group-hover:border-cyan-500/50 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] rounded-xl overflow-hidden bg-[#143845]">
                                        <div className="flex w-full items-start p-3 md:p-4">
                                            <div className="w-[10%] font-bold text-cyan-400">{sortedCirugias.length - index}</div>
                                            <div className="w-[20%] text-[10px] md:text-sm whitespace-nowrap">{formatDateForDisplay(c.fecha)}</div>
                                            <div className="w-[35%] font-semibold leading-tight break-words">
                                                {c.paciente}
                                                <span className="block text-[9px] text-gray-400 font-normal lg:hidden">{c.tipoCirugia}</span>
                                            </div>
                                            <div className="w-[20%]">
                                                <span className="block truncate text-[10px] md:text-xs">{c.medicoOpero || "-"}</span>
                                                {c.medicoOpero && <MedicoPagoDisplay montoHonorarios={c.montoTotalHonorarios} montoPresupuesto={c.montoTotalPresupuesto} participacion={0.50} />}
                                            </div>
                                            <div className="w-[15%] hidden lg:block">
                                                <span className="block truncate text-[10px] md:text-xs">{c.medicoAyudo1 || "-"}</span>
                                                {c.medicoAyudo1 && <MedicoPagoDisplay montoHonorarios={c.montoTotalHonorarios} montoPresupuesto={c.montoTotalPresupuesto} participacion={0.25} />}
                                            </div>
                                            <div className="w-[15%] hidden lg:block">
                                                <span className="block truncate text-[10px] md:text-xs">{c.medicoAyudo2 || "-"}</span>
                                                {c.medicoAyudo2 && <MedicoPagoDisplay montoHonorarios={c.montoTotalHonorarios} montoPresupuesto={c.montoTotalPresupuesto} participacion={0.25} />}
                                            </div>
                                            <div className="w-[15%] lg:w-[10%]"></div>
                                        </div>
                                        <div className="px-3 md:px-4 pb-4">
                                            <div className="flex flex-col space-y-3 p-3 bg-[#1f3b47]/50 rounded-lg border border-gray-700/50">
                                                <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0">
                                                    <div className="flex-1">
                                                        <h4 className="text-white text-[9px] font-bold mb-2 uppercase tracking-tighter">Honorarios / Presupuesto</h4>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <PagoCell total={c.montoTotalHonorarios} pagado={c.montoPagadoHonorarios} estado={c.estadoPagoHonorarios} label="Honorarios" moneda="USD" />
                                                            <PagoCell total={c.montoTotalPresupuesto} pagado={c.montoPagadoPresupuesto} estado={c.estadoPagoPresupuesto} label="Presupuesto" moneda="ARS" />
                                                        </div>
                                                    </div>
                                                    <div className="flex-1">
                                                        <h4 className="text-white text-[9px] font-bold mb-2 uppercase tracking-tighter">Información</h4>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            <div className="text-[10px] text-yellow-300 p-2 border border-gray-600 bg-[#0F2A35] rounded font-semibold text-center truncate">
                                                                {c.obraSocial || "Particular"}
                                                            </div>
                                                            <div className="text-[10px] text-cyan-300 p-2 border border-gray-600 bg-[#0F2A35] rounded font-semibold text-center">
                                                                Edad: {c.edadPaciente !== null ? `${c.edadPaciente}a` : "-"}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="w-full">
                                                    <h4 className="text-white text-[9px] font-bold mb-2 uppercase tracking-tighter">Descripción</h4>
                                                    <div className="text-[10px] text-gray-300 p-2 border border-gray-700 rounded bg-[#0F2A35]/50 leading-snug italic">
                                                        {c.descripcion || "Sin descripción adicional."}
                                                    </div>
                                                </div>
                                                <div className="flex justify-end items-center space-x-3 pt-2 border-t border-gray-600/30">
                                                    <button onClick={(): void => onEditClick(c)} className="flex items-center space-x-2 text-cyan-400 hover:bg-cyan-400/20 px-4 py-2 border border-cyan-700/50 rounded-lg transition text-xs font-bold uppercase">
                                                        <FaEdit className="text-sm" />
                                                        <span>Editar</span>
                                                    </button>
                                                    <button onClick={(): void => onDeleteClick(c)} className="flex items-center space-x-2 text-red-400 hover:bg-red-400/20 px-4 py-2 border border-red-700/50 rounded-lg transition text-xs font-bold uppercase">
                                                        <FaTrash className="text-sm" />
                                                        <span>Borrar</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </React.Fragment>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

interface DeleteCirugiaState {
    id: number | null;
    patientName: string;
}

export default function VerCirugiasContent({ user }: Props): JSX.Element {
    const router = useRouter();
    const [fetchTrigger, setFetchTrigger] = useState<number>(0);
    const [notification, setNotification] = useState<{ message: string, type: "success" | "error" } | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
    const [selectedCirugia, setSelectedCirugia] = useState<Cirugia | null>(null);
    const [deleteCirugia, setDeleteCirugia] = useState<DeleteCirugiaState>({ id: null, patientName: "" });
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

    useEffect((): void => {
        const token: string | null = localStorage.getItem("token");
        if (!user || !user.id || !token) {
            router.push("/");
        }
    }, [user, router]);

    const filteredCirugias: Cirugia[] = useMemo((): Cirugia[] => {
        return allCirugias.filter((c: Cirugia): boolean => {
            const matchPaciente: boolean = filters.selectedPatientName === "" || 
                c.paciente.toLowerCase().includes(filters.selectedPatientName.toLowerCase());
            const matchTipo: boolean = filters.selectedTipoCirugia === "" || 
                c.tipoCirugia.toLowerCase().includes(filters.selectedTipoCirugia.toLowerCase());
            const matchMedico: boolean = filters.selectedMedico === "" || 
                (c.medicoOpero !== null && c.medicoOpero.toLowerCase().includes(filters.selectedMedico.toLowerCase()));
            const matchOS: boolean = filters.selectedObraSocial === "" || 
                (c.obraSocial !== null && c.obraSocial.toLowerCase().includes(filters.selectedObraSocial.toLowerCase()));
            const matchStatus: boolean = filters.selectedStatus === "" || 
                c.estadoPagoHonorarios === filters.selectedStatus;
            return matchPaciente && matchTipo && matchMedico && matchOS && matchStatus;
        });
    }, [allCirugias, filters]);

    const handleEditSubmit = async (cirugiaId: number, updatePayload: Partial<Cirugia>): Promise<void> => {
        try {
            const token: string | null = localStorage.getItem("token");
            if (!token) return;
            const res: Response = await fetch(`http://localhost:3001/api/cirugia/${cirugiaId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ ...updatePayload, usuarioId: user.id }),
            });
            if (res.ok) {
                setNotification({ message: "Actualizado con éxito.", type: "success" });
                setIsEditModalOpen(false);
                setSelectedCirugia(null);
                setFetchTrigger((prev: number): number => prev + 1);
            }
        } catch {
            setNotification({ message: "Error al actualizar.", type: "error" });
        }
    };

    const confirmDelete = async (): Promise<void> => {
        if (deleteCirugia.id === null) return;
        try {
            const token: string | null = localStorage.getItem("token");
            if (!token) return;
            const res: Response = await fetch(`http://localhost:3001/api/cirugia/${deleteCirugia.id}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            if (res.status === 204) {
                setNotification({ message: "Eliminado con éxito.", type: "success" });
                setFetchTrigger((prev: number): number => prev + 1);
            }
        } catch {
            setNotification({ message: "Error al intentar eliminar.", type: "error" });
        } finally {
            setIsConfirmModalOpen(false);
            setDeleteCirugia({ id: null, patientName: "" });
        }
    };

    if (!user || !user.id) return <div />;

    return (
        <div className="w-full max-w-full overflow-x-hidden p-3 md:p-6">
            <h1 className="text-xl md:text-3xl font-bold mb-6 text-white text-center md:text-left">Cirugías</h1>
            {notification && (
                <div className={`p-4 mb-4 rounded-lg flex justify-between items-center ${notification.type === "success" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}>
                    <p className="font-semibold text-xs md:text-base">{notification.message}</p>
                    <button onClick={(): void => setNotification(null)} className="ml-4 font-bold text-lg leading-none">&times;</button>
                </div>
            )}
            <div className="w-full relative">
                <FiltroCirugiaForm 
                    filters={filters} 
                    setFilters={setFilters} 
                    cirugias={allCirugias}
                    medicosOpciones={options.medicos}
                    tiposCirugiaOpciones={options.tipos}
                    obrasSocialesOpciones={options.obrasSociales}
                    onCirugiaAdded={(): void => { setNotification({ message: "Cirugía agregada.", type: "success" }); setFetchTrigger((prev: number): number => prev + 1); }}
                />
            </div>
            {loading && allCirugias.length === 0 ? (
                <div className="text-center text-lg py-10 text-cyan-400 animate-pulse">Buscando cirugías...</div>
            ) : filteredCirugias.length === 0 ? (
                <div className="text-center text-lg py-10 text-red-300">
                    {filters.selectedMedico && !allCirugias.some((c: Cirugia): boolean => c.medicoOpero === filters.selectedMedico) 
                        ? `${filters.selectedMedico} no tiene cirugías` 
                        : "No hay cirugías que coincidan."}
                </div>
            ) : (
                <div className="w-full">
                    <CirugiaTable 
                        cirugias={filteredCirugias} 
                        onEditClick={(c: Cirugia): void => { setSelectedCirugia(c); setIsEditModalOpen(true); }} 
                        onDeleteClick={(c: Cirugia): void => { setDeleteCirugia({ id: c.id, patientName: c.paciente }); setIsConfirmModalOpen(true); }} 
                    />
                </div>
            )}
            {isEditModalOpen && selectedCirugia && (
                <CirugiaDetailModal
                    cirugia={selectedCirugia}
                    onClose={(): void => { setIsEditModalOpen(false); setSelectedCirugia(null); }}
                    onSubmit={handleEditSubmit}
                    medicosOpciones={options.medicos}
                    tiposCirugiaOpciones={options.tipos}
                    obrasSocialesOpciones={options.obrasSociales}
                    showHonorarios={true}
                />
            )}
            <ConfirmDeleteModal
                isOpen={isConfirmModalOpen}
                onClose={(): void => { setIsConfirmModalOpen(false); setDeleteCirugia({ id: null, patientName: "" }); }}
                onConfirm={confirmDelete}
                patientName={deleteCirugia.patientName}
                cirugiaId={deleteCirugia.id || 0}
            />
        </div>
    );
}