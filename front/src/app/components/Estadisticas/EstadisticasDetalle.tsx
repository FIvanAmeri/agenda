import React, { useState, useEffect, useMemo } from "react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts";
import { FaTimes, FaUser, FaCalendarAlt, FaMoneyBillWave } from "react-icons/fa";
import useEstadisticas from "../../hooks/useEstadisticas";

interface ItemEstadistica {
    cantidad: number;
    pacientes: string[];
}

interface ItemPago {
    monto: number;
    pacientes: string[];
}

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
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear);
    const { stats, loading, error, fetchStats } = useEstadisticas();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState("");
    const [modalContent, setModalContent] = useState<string[]>([]);

    const availableYears = useMemo(() => {
        const startYear = 2025;
        const endYear = currentYear + 1;
        const years = [];
        for (let y = startYear; y <= endYear; y++) {
            years.push(y);
        }
        return years;
    }, [currentYear]);

    useEffect(() => {
        fetchStats(selectedYear);
    }, [selectedYear, fetchStats]);

    if (loading) return <div className="p-10 text-white">Cargando estadísticas de {selectedYear}...</div>;
    if (error) return <div className="p-10 text-red-500">Error: {error}</div>;
    if (!stats) return null;

    const dataPagos: BarDataPoint[] = (stats.resumenPagos.mensuales as ItemPago[]).map((item, index) => ({
        mes: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][index],
        monto: item.monto,
        pacientes: item.pacientes
    }));

    const dataEdades: PieDataPoint[] = Object.entries(stats.distribucionEdades).map(([rango, info]) => {
        const detalle = info as ItemEstadistica;
        return { name: rango, value: detalle.cantidad, pacientes: detalle.pacientes };
    });

    const dataObras: PieDataPoint[] = Object.entries(stats.porObraSocial).map(([nombre, info]) => {
        const detalle = info as ItemEstadistica;
        return { name: nombre, value: detalle.cantidad, pacientes: detalle.pacientes };
    });

    const openModal = (title: string, pacientes: string[]) => {
        setModalTitle(title);
        setModalContent(pacientes);
        setModalOpen(true);
    };

    const formatCurrency = (value: number) => {
        return `$${value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    };

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-gray-100 overflow-y-auto custom-scrollbar-subtle relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <h2 className="text-3xl font-bold text-green-400">Panel Anual {selectedYear}</h2>
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

            <div className="mb-8">
                <div className="bg-green-900/20 p-5 rounded-xl border border-green-700/50 inline-block min-w-[280px] shadow-lg">
                    <div className="flex items-center text-green-400 mb-1 gap-2">
                        <FaMoneyBillWave className="text-sm" />
                        <span className="text-xs font-bold uppercase tracking-wider">Monto Total Cobrado</span>
                    </div>
                    <div className="text-4xl font-black text-white">
                        {formatCurrency(stats.resumenPagos.totalAnual)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-cyan-950 p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-cyan-100 text-center">Honorarios Mensuales</h3>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={dataPagos}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="mes" stroke="#9ca3af" />
                                <YAxis stroke="#9ca3af" tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`} />
                                <Tooltip 
                                    formatter={(v: string | number | (string | number)[] | undefined) => {
                                        if (v === undefined) return [formatCurrency(0), "Monto"];
                                        const value = Array.isArray(v) ? Number(v[0]) : Number(v);
                                        return [formatCurrency(value || 0), "Monto"];
                                    }}
                                    contentStyle={{ backgroundColor: "#083344", borderColor: "#155e75" }} 
                                />
                                <Bar 
                                    dataKey="monto" 
                                    fill="#4ade80" 
                                    className="cursor-pointer"
                                    onClick={(data) => {
                                        if (data && data.payload) {
                                            const payload = data.payload as BarDataPoint;
                                            openModal(`Pagos de ${payload.mes} ${selectedYear}`, payload.pacientes);
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

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-cyan-950 p-5 rounded-xl border border-gray-700 h-fit">
                    <h3 className="text-lg font-semibold mb-3 text-cyan-100 border-b border-gray-700 pb-2 text-center">Obras Sociales</h3>
                    <div className="space-y-1 max-h-60 overflow-y-auto custom-scrollbar-subtle pr-2">
                        {dataObras.map((item, idx) => (
                            <div 
                                key={idx} 
                                onClick={() => openModal(`Obra Social: ${item.name}`, item.pacientes)}
                                className="flex justify-between items-center py-1 border-b border-gray-800 last:border-0 cursor-pointer hover:bg-cyan-900 px-2 rounded transition-colors"
                            >
                                <span className="text-xs">{item.name}</span>
                                <span className="font-bold text-green-400 text-sm">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-cyan-950 p-5 rounded-xl border border-gray-700 col-span-2 h-fit">
                    <h3 className="text-lg font-semibold mb-3 text-cyan-100 border-b border-gray-700 pb-2 text-center">Prácticas por Institución</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 max-h-60 overflow-y-auto custom-scrollbar-subtle pr-2">
                        {Object.entries(stats.metricasPracticas).map(([clave, info]) => {
                            const detalle = info as ItemEstadistica;
                            return (
                                <div 
                                    key={clave} 
                                    onClick={() => openModal(clave, detalle.pacientes)}
                                    className="bg-cyan-900/40 p-2 rounded border border-cyan-800 flex items-center justify-between cursor-pointer hover:bg-cyan-800 transition-colors"
                                >
                                    <div className="flex flex-col min-w-0 flex-1">
                                        <span className="text-[9px] font-bold text-cyan-300 uppercase truncate">{clave.split(" - ")[0]}</span>
                                        <span className="text-[11px] font-medium text-gray-200 truncate leading-tight">{clave.split(" - ")[1]}</span>
                                    </div>
                                    <span className="text-sm font-bold text-green-400 ml-3">{detalle.cantidad}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-cyan-950 border border-gray-700 rounded-2xl w-full max-w-md shadow-2xl flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h4 className="text-lg font-bold text-green-400">{modalTitle}</h4>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto custom-scrollbar-subtle flex-grow">
                            <div className="space-y-2">
                                {modalContent.map((paciente, i) => (
                                    <div key={i} className="flex items-center p-2 bg-cyan-900/50 rounded border border-cyan-800">
                                        <FaUser className="text-green-400 mr-3 text-xs" />
                                        <span className="text-sm font-medium">{paciente}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-700 text-right">
                            <button 
                                onClick={() => setModalOpen(false)} 
                                className="px-4 py-2 bg-cyan-800 hover:bg-cyan-700 rounded text-sm font-bold transition-colors"
                            >
                                Cerrar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EstadisticasDetalle;