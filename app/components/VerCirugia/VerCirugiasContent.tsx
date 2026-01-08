"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { User, Cirugia } from "../../components/interfaz/interfaz";
import FiltroCirugiaForm from "../../components/Cirugia/FiltroCirugiaForm";
import { FiltrosCirugia } from "../../components/interfaz/tipos-cirugia";
import {CirugiaDetailModal} from "../../components/Cirugia/CirugiaDetailModal";
import ConfirmDeleteModal from "../../components/Cirugia/ConfirmDeleteModal";
import { useCirugias } from "../../hooks/Cirugia/useCirugiaData";
import NotificationOverlay from "./NotificationOverlay";
import CirugiaTable from "./CirugiaTable";

interface Props {
    user: User;
}

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

    useEffect(() => {
        if (notification) {
            const timer = setTimeout(() => {
                setNotification(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [notification]);

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
                setNotification({ message: "Modificado exitosamente.", type: "success" });
                setIsEditModalOpen(false);
                setFetchTrigger(p => p + 1);
            }
        } catch {
            setNotification({ message: "Error al actualizar.", type: "error" });
        }
    };

    const confirmDelete = async () => {
        if (!deleteCirugia.id) return;
        
        const idAEliminar = deleteCirugia.id;

        try {
            const token = localStorage.getItem("token");
            // Incluimos usuarioId en la query para que el backend sepa de quién es la cirugía
            const res = await fetch(`/api/cirugias/${idAEliminar}?usuarioId=${user.id}`, {
                method: "DELETE",
                headers: { 
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                },
            });

            if (res.ok) {
                setNotification({ message: "Cirugía eliminada correctamente.", type: "success" });
                // Incrementamos el trigger para forzar al hook useCirugias a re-fethchear
                setFetchTrigger(prev => prev + 1);
            } else {
                const errorText = await res.text();
                throw new Error(errorText || "Error al eliminar");
            }
        } catch (err) {
            setNotification({ message: "No se pudo eliminar el registro.", type: "error" });
        } finally {
            setIsConfirmModalOpen(false);
            setDeleteCirugia({ id: null, patientName: "" });
        }
    };

    if (!user?.id) return <div />;

    return (
        <div className="w-full max-w-full overflow-x-hidden p-3 md:p-6 bg-[#0B1E26] min-h-screen relative">
            <h1 className="text-2xl md:text-4xl font-black mb-8 text-white tracking-tighter italic border-l-8 border-cyan-500 pl-4">
                GESTIÓN DE CIRUGÍAS
            </h1>

            {notification && (
                <NotificationOverlay 
                    message={notification.message} 
                    type={notification.type} 
                />
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
                        setDeleteCirugia({ id: Number(c.id), patientName: c.paciente });
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