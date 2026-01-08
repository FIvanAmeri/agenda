"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend
} from "recharts"
import { 
    FaTimes, FaUser, FaCalendarAlt, FaMoneyBillWave, FaExclamationCircle, 
    FaHospital, FaSync, FaShieldAlt, FaCheckCircle, FaFilePdf, FaFileExcel 
} from "react-icons/fa"
import useEstadisticas from "../../hooks/useEstadisticas"
import { useAuth } from "../../context/AuthContext"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import * as XLSX from "xlsx"

interface PacienteDetalle {
    nombre: string
    fecha: string
    monto: number
}

interface BarDataPoint {
    mes: string
    monto: number
    pacientes: PacienteDetalle[]
    [key: string]: string | number | PacienteDetalle[]
}

interface PieDataPoint {
    name: string
    value: number
    pacientes: PacienteDetalle[]
    [key: string]: string | number | PacienteDetalle[]
}

interface AuditoriaObra {
    pagados: number
    pendientes: number
    pacientesPagados: PacienteDetalle[]
    pacientesPendientes: PacienteDetalle[]
}

interface LastAutoTable {
    finalY: number
}

interface JsPDFWithPlugin extends jsPDF {
    lastAutoTable: LastAutoTable
}

interface EstadisticasDetalleProps {
    onSelectPatient: (nombre: string) => void
}

const COLORES = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ffc658"]

const EstadisticasDetalle: React.FC<EstadisticasDetalleProps> = ({ onSelectPatient }) => {
    const { user, loading: authLoading } = useAuth()
    const hoy = new Date()
    const currentYear = hoy.getFullYear()
    const [selectedYear, setSelectedYear] = useState(currentYear)
    const [selectedInstitucion, setSelectedInstitucion] = useState("Todas")
    const { stats, loading, error, fetchStats } = useEstadisticas()
    const [modalOpen, setModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState("")
    const [modalContent, setModalContent] = useState<PacienteDetalle[]>([])

    useEffect(() => {
        if (!authLoading && !user) {
            window.location.href = "/"
        }
    }, [user, authLoading])

    const availableYears = useMemo(() => {
        const years = []
        for (let y = 2025; y <= currentYear; y++) {
            years.push(y)
        }
        return years
    }, [currentYear])

    const refreshData = useCallback(() => {
        if (user) {
            fetchStats(selectedYear)
        }
    }, [user, selectedYear, fetchStats])

    useEffect(() => {
        refreshData()
    }, [refreshData])

    const formatCurrency = (value: number) => {
        return `$${value.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    }

    const institucionesDisponibles = useMemo(() => {
        if (!stats?.pagosDetallados) return ["Todas"]
        const instSet = new Set<string>()
        stats.pagosDetallados.forEach((pago) => {
            if (pago.institucion) instSet.add(pago.institucion)
        })
        return ["Todas", ...Array.from(instSet)]
    }, [stats])

    const dataGraficoBarras = useMemo((): BarDataPoint[] => {
        const nombresMeses = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        const acumulador: BarDataPoint[] = nombresMeses.map(mes => ({
            mes,
            monto: 0,
            pacientes: []
        }))

        if (!stats?.pagosDetallados) return acumulador

        stats.pagosDetallados.forEach((pago) => {
            const fechaPago = new Date(pago.fecha)
            if (fechaPago.getFullYear() === selectedYear) {
                if (selectedInstitucion === "Todas" || pago.institucion === selectedInstitucion) {
                    const mesIndex = fechaPago.getMonth()
                    acumulador[mesIndex].monto += pago.monto
                    acumulador[mesIndex].pacientes.push({
                        nombre: pago.paciente,
                        fecha: new Date(pago.fecha).toLocaleDateString("es-AR"),
                        monto: pago.monto
                    })
                }
            }
        })
        return acumulador
    }, [stats, selectedYear, selectedInstitucion])

    const montoTotalFiltrado = useMemo(() => {
        return dataGraficoBarras.reduce((acc, curr) => acc + curr.monto, 0)
    }, [dataGraficoBarras])

    const dataEdades = useMemo((): PieDataPoint[] => {
        if (!stats?.distribucionEdades) return []
        return Object.entries(stats.distribucionEdades).map(([rango, info]) => ({
            name: rango,
            value: info.cantidad,
            pacientes: info.pacientes.map(p => ({ nombre: p, fecha: "N/A", monto: 0 }))
        }))
    }, [stats])

    const dataObras = useMemo((): PieDataPoint[] => {
        if (!stats?.porObraSocial) return []
        return Object.entries(stats.porObraSocial).map(([nombre, info]) => ({
            name: nombre,
            value: info.cantidad,
            pacientes: info.pacientes.map(p => ({ nombre: p, fecha: "N/A", monto: 0 }))
        }))
    }, [stats])

    const auditoriaDinamica = useMemo(() => {
        if (!stats) return []
        const institucionesMap = new Map<string, Map<string, AuditoriaObra>>()

        Object.entries(stats.metricasPracticas).forEach(([clave, info]) => {
            const parts = clave.split(" - ")
            const inst = parts[0]
            const obra = parts[1] || "Sin Especificar"
            if (!institucionesMap.has(inst)) institucionesMap.set(inst, new Map())
            const obrasMap = institucionesMap.get(inst)!
            if (!obrasMap.has(obra)) obrasMap.set(obra, { pagados: 0, pendientes: 0, pacientesPagados: [], pacientesPendientes: [] })
            const data = obrasMap.get(obra)!
            data.pagados += info.cantidad
            const nuevosPacientes = info.pacientes.map(p => ({ nombre: p, fecha: "Pagado", monto: 0 }))
            data.pacientesPagados = [...data.pacientesPagados, ...nuevosPacientes]
        })

        Object.entries(stats.metricasNoPagados).forEach(([clave, info]) => {
            const parts = clave.split(" - ")
            const inst = parts[0]
            const obra = parts[1] || "Sin Especificar"
            if (!institucionesMap.has(inst)) institucionesMap.set(inst, new Map())
            const obrasMap = institucionesMap.get(inst)!
            if (!obrasMap.has(obra)) obrasMap.set(obra, { pagados: 0, pendientes: 0, pacientesPagados: [], pacientesPendientes: [] })
            const data = obrasMap.get(obra)!
            data.pendientes += info.cantidad
            const nuevosPacientes = info.pacientes.map(p => ({ nombre: p, fecha: "Pendiente", monto: 0 }))
            data.pacientesPendientes = [...data.pacientesPendientes, ...nuevosPacientes]
        })

        return Array.from(institucionesMap.entries())
    }, [stats])

    const exportToPDF = () => {
        const doc = new jsPDF() as JsPDFWithPlugin
        doc.setFillColor(8, 51, 68)
        doc.rect(0, 0, 210, 40, "F")
        doc.setTextColor(255, 255, 255)
        doc.setFontSize(22)
        doc.setFont("helvetica", "bold")
        doc.text("REPORTE DE AUDITORÍA", 14, 25)
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text(`Fecha de emisión: ${new Date().toLocaleDateString()}`, 150, 25)
        doc.setTextColor(50, 50, 50)
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.text("DATOS DEL PERIODO", 14, 55)
        doc.setFont("helvetica", "normal")
        doc.setFontSize(10)
        doc.text(`Institución seleccionada: ${selectedInstitucion}`, 14, 62)
        doc.text(`Año lectivo: ${selectedYear}`, 14, 68)
        doc.setFillColor(240, 253, 244)
        doc.roundedRect(140, 50, 56, 22, 2, 2, "F")
        doc.setTextColor(21, 128, 61)
        doc.setFont("helvetica", "bold")
        doc.text("TOTAL LIQUIDADO", 145, 58)
        doc.setFontSize(14)
        doc.text(formatCurrency(montoTotalFiltrado), 145, 66)

        const tableData: string[][] = []
        auditoriaDinamica.forEach(([inst, obras]) => {
            if (selectedInstitucion === "Todas" || inst === selectedInstitucion) {
                obras.forEach((data, obra) => {
                    tableData.push([inst, obra, data.pagados.toString(), data.pendientes.toString(), (data.pagados + data.pendientes).toString()])
                })
            }
        })

        autoTable(doc, {
            head: [["INSTITUCIÓN", "PRÁCTICA", "PAGADOS", "PENDIENTES", "TOTAL"]],
            body: tableData,
            startY: 80,
            theme: "grid",
            headStyles: { 
                fillColor: [15, 118, 110], 
                textColor: [255, 255, 255], 
                fontSize: 9, 
                halign: "center",
                fontStyle: "bold"
            },
            styles: { 
                fontSize: 8, 
                cellPadding: 4,
                valign: "middle"
            },
            columnStyles: {
                2: { halign: "center", fontStyle: "bold" },
                3: { halign: "center", fontStyle: "bold", textColor: [185, 28, 28] },
                4: { halign: "center", fontStyle: "bold" }
            },
            alternateRowStyles: { fillColor: [245, 245, 245] }
        })

        const finalY = doc.lastAutoTable.finalY || 80
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text("Este documento es un reporte generado automáticamente por el sistema de gestión médica.", 14, finalY + 20)
        doc.save(`Reporte_${selectedInstitucion}_${selectedYear}.pdf`)
    }

    const exportToExcel = () => {
        const excelData = auditoriaDinamica
            .filter(([inst]) => selectedInstitucion === "Todas" || inst === selectedInstitucion)
            .flatMap(([inst, obras]) => 
                Array.from(obras.entries()).map(([obra, data]) => ({
                    Institucion: inst,
                    ObraSocial: obra,
                    Pagados: data.pagados,
                    Pendientes: data.pendientes,
                    Total: data.pagados + data.pendientes
                }))
            )
        const ws = XLSX.utils.json_to_sheet(excelData)
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, ws, "Auditoria")
        XLSX.writeFile(wb, `Auditoria_${selectedInstitucion}_${selectedYear}.xlsx`)
    }

    const openModal = (title: string, pacientes: PacienteDetalle[]) => {
        setModalTitle(title)
        setModalContent(pacientes)
        setModalOpen(true)
    }

    if (authLoading || loading) return <div className="p-10 text-white font-bold">Cargando estadísticas...</div>
    if (error) return <div className="p-10 text-red-500 font-bold">Error: {error}</div>
    if (!user || !stats) return null

    return (
        <div className="p-6 bg-gray-900 min-h-screen text-gray-100 overflow-y-auto relative">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-3xl font-bold text-green-400">Liquidación Anual {selectedYear}</h2>
                    <button onClick={refreshData} className="p-2 bg-cyan-900/50 hover:bg-cyan-800 rounded-full transition-colors text-cyan-400">
                        <FaSync className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
                <div className="flex flex-wrap gap-3">
                    <button onClick={exportToPDF} className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-600/50 rounded-lg transition-all font-bold text-xs"><FaFilePdf /> PDF</button>
                    <button onClick={exportToExcel} className="flex items-center gap-2 px-4 py-2 bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white border border-green-600/50 rounded-lg transition-all font-bold text-xs"><FaFileExcel /> EXCEL</button>
                    <div className="flex items-center bg-cyan-950 border border-gray-700 rounded-lg px-3 py-2">
                        <FaHospital className="text-cyan-400 mr-3" />
                        <select value={selectedInstitucion} onChange={(e) => setSelectedInstitucion(e.target.value)} className="bg-transparent border-none text-white focus:ring-0 cursor-pointer font-bold outline-none text-sm">
                            {institucionesDisponibles.map(inst => <option key={inst} value={inst} className="bg-gray-800 text-white">{inst}</option>)}
                        </select>
                    </div>
                    <div className="flex items-center bg-cyan-950 border border-gray-700 rounded-lg px-3 py-2">
                        <FaCalendarAlt className="text-cyan-400 mr-3" />
                        <select value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))} className="bg-transparent border-none text-white focus:ring-0 cursor-pointer font-bold outline-none">
                            {availableYears.map(y => <option key={y} value={y} className="bg-gray-800 text-white">{y}</option>)}
                        </select>
                    </div>
                </div>
            </div>

            <div className="mb-8">
                <div className="bg-green-900/20 p-5 rounded-xl border border-green-700/50 inline-block min-w-70 shadow-lg">
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
                                    formatter={(value: number | string | (string | number)[] | undefined) => [formatCurrency(Number(value || 0)), "Monto"]} 
                                    contentStyle={{ backgroundColor: "#083344", borderColor: "#155e75", color: "#fff" }} 
                                />
                                <Bar 
                                    dataKey="monto" 
                                    fill="#4ade80" 
                                    radius={[4, 4, 0, 0]}
                                    className="cursor-pointer" 
                                    onClick={(data) => { if (data && data.payload) openModal(`Cobros ${String(data.payload.mes)}`, data.payload.pacientes) }} 
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
                                    cx="50%" 
                                    cy="50%" 
                                    innerRadius={60} 
                                    outerRadius={100} 
                                    paddingAngle={5} 
                                    dataKey="value" 
                                    className="cursor-pointer" 
                                    onClick={(data) => { if (data && data.payload) openModal(`Rango ${String(data.payload.name)}`, data.payload.pacientes) }}
                                >
                                    {dataEdades.map((_, index) => <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />)}
                                </Pie>
                                <Tooltip 
                                    formatter={(value: number | string | (string | number)[] | undefined) => [value || 0, "Pacientes"]}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="space-y-12 mb-12">
                {auditoriaDinamica
                    .filter(([instName]) => selectedInstitucion === "Todas" || instName === selectedInstitucion)
                    .map(([instName, obrasMap]) => (
                    <div key={instName} className="bg-cyan-950/40 p-6 rounded-2xl border border-gray-700 shadow-xl">
                        <h3 className="text-2xl font-bold mb-6 text-cyan-100 flex items-center gap-3 border-b border-gray-700 pb-4">
                            <FaShieldAlt className="text-cyan-400" /> Auditoría: {instName}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from(obrasMap.entries()).map(([obraName, data]) => (
                                <div key={obraName} className="bg-gray-900/60 rounded-2xl border border-gray-700 p-5 shadow-lg">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-lg font-black text-white truncate pr-2">{obraName}</h4>
                                        <span className="bg-cyan-500/10 text-cyan-400 text-xs font-bold px-2 py-1 rounded border border-cyan-500/20">Total: {data.pagados + data.pendientes}</span>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-center">
                                        <div onClick={() => openModal(`Pagados: ${obraName} (${instName})`, data.pacientesPagados)} className="bg-green-500/5 border border-green-500/20 rounded-xl p-3 cursor-pointer hover:bg-green-500/10 transition-all">
                                            <div className="flex items-center justify-center gap-1 mb-1"><FaCheckCircle className="text-green-500 text-[10px]" /><p className="text-[10px] font-bold text-green-500 uppercase">Pagados</p></div>
                                            <p className="text-2xl font-black text-white">{data.pagados}</p>
                                        </div>
                                        <div onClick={() => openModal(`Pendientes: ${obraName} (${instName})`, data.pacientesPendientes)} className="bg-red-500/5 border border-red-500/20 rounded-xl p-3 cursor-pointer hover:bg-red-500/10 transition-all">
                                            <div className="flex items-center justify-center gap-1 mb-1"><FaExclamationCircle className="text-red-500 text-[10px]" /><p className="text-[10px] font-bold text-red-500 uppercase">Pendientes</p></div>
                                            <p className="text-2xl font-black text-white">{data.pendientes}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-8">
                <div className="bg-cyan-950 p-6 rounded-xl border border-gray-700 shadow-lg">
                    <h3 className="text-xl font-semibold mb-6 text-green-400 flex items-center gap-2"><FaMoneyBillWave /> Prácticas Cobradas (Global)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(stats.metricasPracticas)
                            .filter(([clave]) => selectedInstitucion === "Todas" || clave.startsWith(selectedInstitucion))
                            .map(([clave, info]) => (
                            <div key={clave} onClick={() => openModal(clave, info.pacientes.map(p => ({ nombre: p, fecha: "Pagado", monto: 0 })))} className="bg-cyan-900/40 p-4 rounded-xl border border-cyan-800 flex items-center justify-between cursor-pointer hover:bg-cyan-800 transition-all">
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
                    <h3 className="text-xl font-semibold mb-6 text-red-400 flex items-center gap-2"><FaExclamationCircle /> Estudios No Pagados (Global)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {Object.entries(stats.metricasNoPagados)
                            .filter(([clave]) => selectedInstitucion === "Todas" || clave.startsWith(selectedInstitucion))
                            .map(([clave, info]) => (
                            <div key={clave} onClick={() => openModal(`PENDIENTE: ${clave}`, info.pacientes.map(p => ({ nombre: p, fecha: "Pendiente", monto: 0 })))} className="bg-red-950/20 p-4 rounded-xl border border-red-900/30 flex items-center justify-between cursor-pointer hover:bg-red-900/30 transition-all">
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
                <h3 className="text-lg font-semibold mb-3 text-cyan-100 border-b border-gray-700 pb-2 text-center">Obras Sociales Atendidas</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {dataObras.map((item, idx) => (
                        <div key={idx} onClick={() => openModal(`Obra Social: ${item.name}`, item.pacientes)} className="flex justify-between items-center p-2 bg-cyan-900/30 rounded border border-gray-800 cursor-pointer hover:bg-cyan-900 transition-colors">
                            <span className="text-[10px] truncate mr-2 uppercase font-bold">{item.name}</span>
                            <span className="font-bold text-green-400 text-xs">{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>

            {modalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
                    <div className="bg-cyan-950 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh]">
                        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
                            <h4 className="text-lg font-bold text-green-400">{modalTitle}</h4>
                            <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-white">
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <div className="p-4 overflow-y-auto grow space-y-2">
                            {modalContent.length > 0 ? modalContent.map((p, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-cyan-900/50 rounded border border-cyan-800 transition-all">
                                    <div className="flex items-center min-w-0 flex-1">
                                        <FaUser className="text-green-400 mr-3 text-xs shrink-0" />
                                        <span className="text-sm font-medium truncate">{p.nombre}</span>
                                    </div>
                                    <div className="flex items-center gap-4 ml-4 shrink-0">
                                        <div className="text-right">
                                            <p className="text-[10px] text-cyan-400 font-bold uppercase">{p.fecha}</p>
                                            {p.monto > 0 && <p className="text-xs font-black text-white">{formatCurrency(p.monto)}</p>}
                                        </div>
                                    </div>
                                </div>
                            )) : <div className="text-center py-4 text-gray-400 text-sm">Sin registros.</div>}
                        </div>
                        <div className="p-4 border-t border-gray-700 text-right">
                            <button onClick={() => setModalOpen(false)} className="px-4 py-2 bg-cyan-800 hover:bg-cyan-700 rounded text-sm font-bold">Cerrar</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default EstadisticasDetalle