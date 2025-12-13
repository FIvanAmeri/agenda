"use client";

import React, { useEffect, useState } from "react";
import { User, Cirugia } from "../../components/interfaz/interfaz";
import FiltroCirugiaForm from "../../components/Cirugia/FiltroCirugiaForm";
import { FiltrosCirugia } from "../../components/interfaz/tipos-cirugia";
import { FaEdit, FaTrash, FaCheckCircle, FaTimesCircle, FaClock } from "react-icons/fa"; 

interface Props {
    user: User
}

const formatDateForDisplay = (isoDate: string): string => {
    const date = new Date(isoDate + 'T00:00:00'); 
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const formatCurrency = (amount: number | null): string => {
    if (amount === null || amount === undefined) return "$ -";
    const numericAmount: number = Number(amount);
    return new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(numericAmount);
};

const getEstadoIcon = (estado: Cirugia["estadoPagoHonorarios"]): JSX.Element => {
    switch (estado) {
        case "pagado":
            return <FaCheckCircle className="text-green-400 mr-1" />;
        case "parcialmente pagado":
            return <FaClock className="text-yellow-400 mr-1" />;
        case "no pagado":
        default:
            return <FaTimesCircle className="text-red-400 mr-1" />;
    }
};

const getEstadoClass = (estado: Cirugia["estadoPagoHonorarios"]): string => {
    switch (estado) {
        case "pagado":
            return "bg-green-600/20 border-green-500/50";
        case "parcialmente pagado":
            return "bg-yellow-600/20 border-yellow-500/50";
        case "no pagado":
        default:
            return "bg-red-600/20 border-red-500/50";
    }
};

interface PagoCellProps {
    total: number | null
    pagado: number
    estado: Cirugia["estadoPagoHonorarios"]
    label: string
}

const PagoCell: React.FC<PagoCellProps> = ({ total, pagado, estado, label }) => (
    <div className={`p-1 rounded-md text-xs font-semibold whitespace-nowrap border ${getEstadoClass(estado)}`}>
        <strong className="text-gray-300 block mb-0.5">{label}</strong>
        {total === null ? (
            "N/A"
        ) : (
            `${formatCurrency(pagado)} / ${formatCurrency(total)}`
        )}
    </div>
);


interface CirugiaTableProps {
    cirugias: Cirugia[]
    onEditClick: (c: Cirugia) => void
    onDeleteClick: (id: number) => void
}

const CirugiaTable: React.FC<CirugiaTableProps> = ({ cirugias, onEditClick, onDeleteClick }) => {
    
    const sortedCirugias: Cirugia[] = [...cirugias].sort((a: Cirugia, b: Cirugia) => b.id - a.id);
    const COLSPAN_COUNT = 9;

    return (
        <div className="mt-8 overflow-x-auto">
            <table className="min-w-full table-auto bg-[#0F2A35] shadow-2xl rounded-lg overflow-hidden border border-[#1f3b47]">
                <thead className="bg-[#0c4a34] text-white uppercase text-xs tracking-wider">
                    <tr>
                        <th className="py-3 px-4 text-left w-12 min-w-[48px]">ID</th>
                        <th className="py-3 px-4 text-left w-24 min-w-[96px]">Fecha</th>
                        <th className="py-3 px-4 text-left min-w-[120px]">Paciente</th>
                        <th className="py-3 px-4 text-left w-16 min-w-[64px]">Edad</th>
                        <th className="py-3 px-4 text-left min-w-[120px]">Tipo</th>
                        <th className="py-3 px-4 text-left w-24 min-w-[96px]">Operó</th>
                        <th className="py-3 px-4 text-left w-24 min-w-[96px]">Ayud. 1</th>
                        <th className="py-3 px-4 text-left w-24 min-w-[96px]">Ayud. 2</th>
                        <th className="py-3 px-4 text-left w-12"></th>
                    </tr>
                </thead>

                <tbody className="text-gray-200 text-sm">
                    {sortedCirugias.map((c: Cirugia, index: number) => (
                        <React.Fragment key={c.id}>
                            <tr
                                className={`transition duration-150 ${
                                    index % 2 === 0 ? "bg-[#143845]" : "bg-[#1a4553]"
                                } hover:bg-[#1f5666] border-b border-[#1f3b47]`}
                            >
                                <td className="py-3 px-4 font-bold align-top break-words">{c.id}</td>
                                <td className="py-3 px-4 whitespace-nowrap align-top break-words">{formatDateForDisplay(c.fecha)}</td>
                                <td className="py-3 px-4 font-semibold align-top break-words">{c.paciente}</td>
                                <td className="py-3 px-4 align-top whitespace-nowrap break-words">
                                    {c.edadPaciente !== null ? `${c.edadPaciente} años` : "-"}
                                </td>
                                <td className="py-3 px-4 align-top break-words">{c.tipoCirugia}</td>
                                <td className="py-3 px-4 text-xs align-top break-words">{c.medicoOpero || "-"}</td>
                                <td className="py-3 px-4 text-xs align-top break-words">{c.medicoAyudo1 || "-"}</td>
                                <td className="py-3 px-4 text-xs align-top break-words">{c.medicoAyudo2 || "-"}</td>
                                <td className="py-3 px-4 align-top"></td>
                            </tr>
                            
                            <tr className={`${index % 2 === 0 ? "bg-[#143845]" : "bg-[#1a4553]"}`}>
                                <td colSpan={COLSPAN_COUNT} className="pt-0 pb-3 px-4 min-h-[100px]">
                                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-3 md:space-y-0 p-3 bg-[#1f3b47] rounded-b-lg border-t border-gray-700 min-h-[100px]">
                                        
                           
                                        <div className="flex-1 min-w-[250px]">
                                            <h4 className="text-white text-xs font-bold mb-2 uppercase">Honorarios / Presupuesto</h4>
                                            <div className="flex space-x-3">
                                                <PagoCell 
                                                    total={c.montoTotalHonorarios} 
                                                    pagado={c.montoPagadoHonorarios} 
                                                    estado={c.estadoPagoHonorarios}
                                                    label="Honorarios"
                                                />
                                                <PagoCell 
                                                    total={c.montoTotalPresupuesto} 
                                                    pagado={c.montoPagadoPresupuesto} 
                                                    estado={c.estadoPagoPresupuesto}
                                                    label="Presupuesto"
                                                />
                                            </div>
                                        </div>
                                        
                                        <div className="flex-1 min-w-[250px] flex flex-col">
                                            <h4 className="text-white text-xs font-bold mb-2 uppercase">Descripción</h4>
                                           <div className="text-xs text-gray-300 p-2 border border-gray-700 rounded-lg flex-grow min-h-[60px] break-words whitespace-normal">
                                                {c.descripcion || "Sin descripción."}
                                            </div>
                                        </div>

                                      
                                        <div className="w-full md:w-auto flex flex-col justify-end items-end p-2">
                                            <h4 className="text-white text-xs font-bold mb-2 uppercase hidden md:block">Acciones</h4>
                                            <div className="flex justify-end items-center mt-auto">
                                                <button
                                                    onClick={() => onEditClick(c)}
                                                    className="text-cyan-400 hover:text-cyan-600 p-2 mr-2 border border-cyan-700/50 rounded-lg transition"
                                                    title="Editar"
                                                >
                                                    <FaEdit className="inline-block text-base" />
                                                </button>
                                                <button
                                                    onClick={() => onDeleteClick(c.id)}
                                                    className="text-red-400 hover:text-red-600 p-2 border border-red-700/50 rounded-lg transition"
                                                    title="Eliminar"
                                                >
                                                    <FaTrash className="inline-block text-base" />
                                                </button>
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


export default function VerCirugiasContent({ user }: Props): JSX.Element {
    const [cirugias, setCirugias] = useState<Cirugia[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [filters, setFilters] = useState<FiltrosCirugia>({
        dateFrom: "",
        dateTo: "",
        selectedPatientName: "",
        selectedTipoCirugia: "",
        selectedMedico: "",
        selectedStatus: "",
    });
    const [fetchTrigger, setFetchTrigger] = useState<number>(0);

    const fetchCirugias = async (currentFilters: FiltrosCirugia): Promise<void> => {
        setLoading(true);
        try {
            const token: string | null = localStorage.getItem("token");
            if (!token) return;

            const params: URLSearchParams = new URLSearchParams();
            if (currentFilters.dateFrom) params.append("dateFrom", currentFilters.dateFrom);
            if (currentFilters.dateTo) params.append("dateTo", currentFilters.dateTo);
            if (currentFilters.selectedPatientName) params.append("paciente", currentFilters.selectedPatientName);
            if (currentFilters.selectedTipoCirugia) params.append("tipoCirugia", currentFilters.selectedTipoCirugia);
            if (currentFilters.selectedMedico) params.append("medico", currentFilters.selectedMedico);
            if (currentFilters.selectedStatus) params.append("estadoPago", currentFilters.selectedStatus);

            const url: string = `http://localhost:3001/api/cirugia?${params.toString()}`;

            const res: Response = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data: { data: Cirugia[] } = await res.json();

            if (res.ok && data && Array.isArray(data.data)) {
                setCirugias(data.data);
            } else {
                setCirugias([]);
            }
        } catch {
            setCirugias([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCirugias(filters); 
    }, [filters, user.id, fetchTrigger]);

    const handleEditClick = (cirugia: Cirugia): void => {
        window.alert(`Editar cirugía ID: ${cirugia.id}`);
    };

    const handleDeleteClick = (cirugiaId: number): void => {
        if (window.confirm(`¿Estás seguro de que quieres eliminar la cirugía ID: ${cirugiaId}?`)) {
            window.alert(`Implementar lógica de borrado para ID: ${cirugiaId}`);
        }
    };

    if (loading) {
        return (
            <div className="text-center text-xl py-10 text-white">
                Cargando cirugías...
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-white">Cirugías</h1>

            <FiltroCirugiaForm 
                filters={filters} 
                setFilters={setFilters} 
                cirugias={cirugias}
            />

            {cirugias.length === 0 && (
                <div className="text-center text-xl py-10 text-red-300">
                    No hay cirugías que coincidan con los filtros.
                </div>
            )}
            
            {cirugias.length > 0 && (
                <CirugiaTable 
                    cirugias={cirugias} 
                    onEditClick={handleEditClick} 
                    onDeleteClick={handleDeleteClick} 
                />
            )}
        </div>
    );
}