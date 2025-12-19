"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import { FaTimes, FaUser, FaCalendarAlt, FaMoneyBillWave, FaExclamationCircle, FaHospital, FaSync } from "react-icons/fa";
import useEstadisticas from "../../hooks/useEstadisticas";
import { useAuth } from "../../context/AuthContext";

interface BarDataPoint {
    mes: string;
    monto: number;
    pacientes: string[];
    [key: string]: string | number | string[];
}

interface PieDataPoint {
    name: string;
    value: number;
    pacientes: string[];
    [key: string]: string | number | string[];
}

const COLORES = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"];

const EstadisticasDetalle: React.FC = () => {
    const { user, loading: authLoading } = useAuth();
    const hoy = new Date();
    const currentYear = hoy.getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const [selectedInstitucion, setSelectedInstitucion] = useState("Todas");
    const { stats, loading, error, fetchStats } = useEstadisticas();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState<string[]>([]);

    useEffect(() => {
        if (!authLoading && !user) {
            window.location.href = "/";
        }
    }, [user, authLoading]);

    const availableYears = useMemo(() => {
        const years = [];
        const baseYear = 2025;
        for (let y = baseYear; y <= currentYear; y++) {
            years.push(y);
        }
        return years;
    }, [currentYear]);

    const institucionesDisponibles = useMemo(() => {
        if (!stats?.pagosDetallados) return ["Todas"];
        const instSet = new Set<string>();
        stats.pagosDetallados.forEach((pago) => {
            if (pago.institucion) instSet.add(pago.institucion);
        });
        return ["Todas", ...Array.from(instSet)];
    }, [stats]);

    const refreshData = useCallback(() => {
        if (user) {
            fetchStats(selectedYear);
        }
    }, [user, selectedYear, fetchStats]);

    useEffect(() => {
        refreshData();
    }, [refreshData]);

    const dataGraficoBarras = useMemo((): BarDataPoint[] => {
        const nombresMeses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
        const acumulador = nombresMeses.map(mes => ({
            mes,
            monto: 0,
            pacientes: [] as string[]
        }));

        if (!stats?.pagosDetallados) return acumulador;

        stats.pagosDetallados.forEach((pago) => {
            const fechaPago = new Date(pago.fecha);
            if (fechaPago.getFullYear() === selectedYear) {
                if (selectedInstitucion === "Todas" || pago.institucion === selectedInstitucion) {
                    const mesIndex = fechaPago.getMonth();
                    acumulador[mesIndex].monto += pago.monto;
                    acumulador[mesIndex].pacientes.push(`${pago.paciente} (${pago.institucion})`);
                }
            }
        });
        return acumulador;
    }, [stats, selectedYear, selectedInstitucion]);

    const montoTotalFiltrado = useMemo(() => {
        return dataGraficoBarras.reduce((acc, curr) => acc + curr.monto, 0);
    }, [dataGraficoBarras]);

    const dataEdades = useMemo((): PieDataPoint[] => {
        if (!stats?.distribucionEdades) return [];
        return Object.entries(stats.distribucionEdades).map(([rango, info]) => ({
            name: rango,
            value: info.cantidad,
            pacientes: info.pacientes
        }));
    }, [stats]);

    const dataObras = useMemo((): PieDataPoint[] => {
        if (!stats?.porObraSocial) return [];
        return Object.entries(stats.porObraSocial).map(([nombre, info]) => ({
            name: nombre,
            value: info.cantidad,
            pacientes: info.pacientes
        }));
    }, [stats]);

    const openModal = (title: string, pacientes: string[]) => {
        setModalTitle(title);
        setModalContent(pacientes);
        setModalOpen(true);
    };

    const formatCurrency = (value: number) => {
        return `$${value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    if (authLoading || loading) return <div className="p-10 text-white font-bold">Cargando estadísticas...</div>;
    if (error) return <div className="p-10 text-red-500 font-bold">Error: {error}</div>;
    if (!user || !stats) return null;

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-gray-100 overflow-y-auto relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold text-green-400">Liquidación Anual {selectedYear}</h2>
                    <button 
                        onClick={refreshData}
                        className="p-2 bg-cyan-900/50 hover:bg-cyan-800 rounded-full transition-colors text-cyan-400"
                        title="Actualizar tabla"
                    >
                        <FaSync className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex items-center bg-cyan-950 border border-gray-700 rounded-lg px-3 py-2 shadow-inner">
                        <FaHospital className="text-cyan-400 mr-3" />
                        <select 
                            value={selectedInstitucion}
                            onChange={(e) => setSelectedInstitucion(e.target.value)}
                            className="bg-transparent border-none text-white focus:ring-0 cursor-pointer font-bold outline-none text-sm"
                        >
                            {institucionesDisponibles.map(inst => (
                                <option key={inst} value={inst} className="bg-gray-800 text-white">{inst}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex items-center bg-cyan-950 border border-gray-700 rounded-lg px-3 py-2 shadow-inner">
                        <FaCalendarAlt className="text-cyan-400 mr-3" />
                        <select 
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(Number(e.target.value))}
                            className="bg-transparent border-none text-white focus:ring-0 cursor-pointer font-bold outline-none"
                        >
                            {availableYears.map(y => (
                                <option key={y} value={y} className="bg-gray-800 text-white">{y}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <div className="bg-green-900/20 p-5 rounded-xl border border-green-700/50 inline-block min-w-[280px] shadow-lg">
                    <div className="flex items-center text-green-400 mb-1 gap-2">
                        <FaMoneyBillWave className="text-sm" />
                        <span className="text-xs font-bold uppercase tracking-wider">Total Cobrado {selectedInstitucion}</span>
                    </div>
                    <div className="text-4xl font-black text-white">{formatCurrency(montoTotalFiltrado)}</div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-cyan-950 p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-cyan-100 text-center">Honorarios Mensuales</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataGraficoBarras}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="mes" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                                <Tooltip 
                                    formatter={(value: number | undefined) => [formatCurrency(value ?? 0), "Monto"]}
                                    contentStyle={{ backgroundColor: "#083344", borderColor: "#155e75", color: "#fff" }} 
                                />
                                <Bar 
                                    dataKey="monto" 
                                    fill="#4ade80" 
                                    className="cursor-pointer"
                                    onClick={(data) => {
                                        if (data && data.payload) {
                                            const payload = data.payload as BarDataPoint;
                                            openModal(`Cobros ${payload.mes} - ${selectedInstitucion}`, payload.pacientes);
                                        }
                                    }}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-cyan-950 p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-cyan-100 text-center">Distribución por Edades</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={dataEdades}
                                    cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value"
                                    className="cursor-pointer"
                                    onClick={(data) => {
                                        if (data && data.payload) {
                                            const payload = data.payload as PieDataPoint;
                                            openModal(`Pacientes Rango ${payload.name}`, payload.pacientes);
                                        }
                                    }}
                                >
                                    {dataEdades.map((_, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="bg-cyan-950 p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-xl font-semibold mb-6 text-green-400 flex items-center gap-2"><FaMoneyBillWave /> Prácticas Cobradas</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(stats.metricasPracticas).map(([clave, info]) => (
                            <div key={clave} onClick={() => openModal(clave, info.pacientes)} className="bg-cyan-900/40 p-4 rounded-xl border border-cyan-800 flex items-center justify-between cursor-pointer hover:bg-cyan-800 transition-all">
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-[10px] font-bold text-cyan-300 uppercase truncate">{clave.split(" - ")[0]}</span>
                                    <span className="text-sm font-medium text-gray-200 truncate leading-tight">{clave.split(" - ")[1]}</span>
                                </div>
                                <span className="text-xl font-black text-green-400 ml-4">{info.cantidad}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-gray-900/50 p-6 rounded-xl border border-red-900/30 shadow-lg">
                    <h3 className="text-xl font-semibold mb-6 text-red-400 flex items-center gap-2"><FaExclamationCircle /> Estudios No Pagados</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(stats.metricasNoPagados).map(([clave, info]) => (
                            <div key={clave} onClick={() => openModal(`PENDIENTE: ${clave}`, info.pacientes)} className="bg-red-950/20 p-4 rounded-xl border border-red-900/30 flex items-center justify-between cursor-pointer hover:bg-red-900/30 transition-all">
                                <div className="flex flex-col min-w-0 flex-1">
                                    <span className="text-[10px] font-bold text-red-300 uppercase truncate">{clave.split(" - ")[0]}</span>
                                    <span className="text-sm font-medium text-gray-200 truncate leading-tight">{clave.split(" - ")[1]}</span>
                                </div>
                                <span className="text-xl font-black text-red-400 ml-4">{info.cantidad}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="mt-8 bg-cyan-950 p-5 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold mb-3 text-cyan-100 border-b border-gray-700 pb-2 text-center">Obras Sociales</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {dataObras.map((item, idx) => (
                        <div 
                            key={idx} 
                            onClick={() => openModal(`Obra Social: ${item.name}`, item.pacientes)}
                            className="flex justify-between items-center p-2 bg-cyan-900/30 rounded border border-gray-800 cursor-pointer hover:bg-cyan-900"
                        >
                            <span className="text-[10px] truncate mr-2">{item.name}</span>
                            <span className="font-bold text-green-400 text-xs">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-cyan-950 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h4 className="text-lg font-bold text-green-400">{modalTitle}</h4>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white"><FaTimes size={20} /></button>
                        </div>
                        <div className="p-4 overflow-y-auto flex-grow space-y-2">
                            {modalContent.map((paciente, i) => (
                                <div key={i} className="flex items-center p-2 bg-cyan-900/50 rounded border border-cyan-800">
                                    <FaUser className="text-green-400 mr-3 text-xs" />
                                    <span className="text-sm font-medium">{paciente}</span>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t border-gray-700 text-right">
                            <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-cyan-800 hover:bg-cyan-700 rounded text-sm font-bold">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EstadisticasDetalle;