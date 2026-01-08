"use client"

import React, { useCallback, useMemo, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Patient } from "../interfaz/interfaz"
import { FaFilter, FaRedo, FaTimesCircle, FaChevronDown } from "react-icons/fa"
import AutocompleteInput from "./AutocompleteInput"
import { useFilterDropdowns, FilterFieldKey } from "../../hooks/Filtro/useFilterDropdowns"
import { usePatientLists } from "../../hooks/Filtro/usePatientLists"

interface FilterFormProps {
    selectedDateFrom: string
    setSelectedDateFrom: React.Dispatch<React.SetStateAction<string>>
    selectedDateTo: string
    setSelectedDateTo: React.Dispatch<React.SetStateAction<string>>
    selectedPatientName: string
    setSelectedPatientName: React.Dispatch<React.SetStateAction<string>>
    selectedPractice: string
    setSelectedPractice: React.Dispatch<React.SetStateAction<string>>
    selectedObraSocial: string
    setSelectedObraSocial: React.Dispatch<React.SetStateAction<string>>
    selectedInstitucion: string
    setSelectedInstitucion: React.Dispatch<React.SetStateAction<string>>
    selectedStatus: string
    setSelectedStatus: React.Dispatch<React.SetStateAction<string>>
    patients: Patient[]
}

const formatISO = (date: Date | null): string => {
    if (!date) return ""
    const d = date.getDate().toString().padStart(2, "0")
    const m = (date.getMonth() + 1).toString().padStart(2, "0")
    const y = date.getFullYear()
    return `${y}-${m}-${d}`
}

const parseISO = (iso: string): Date | null => {
    if (!iso) return null
    const parts = iso.split("-")
    if (parts.length !== 3) return new Date(iso)
    const y = Number(parts[0])
    const m = Number(parts[1]) - 1
    const d = Number(parts[2])
    return new Date(y, m, d)
}

const parseDatePickerValue = (date: Date | null): string => {
    return formatISO(date)
}

const FilterForm: React.FC<FilterFormProps> = ({
    selectedDateFrom,
    setSelectedDateFrom,
    selectedDateTo,
    setSelectedDateTo,
    selectedPatientName,
    setSelectedPatientName,
    selectedPractice,
    setSelectedPractice,
    selectedObraSocial,
    setSelectedObraSocial,
    selectedInstitucion,
    setSelectedInstitucion,
    selectedStatus,
    setSelectedStatus,
    patients,
}) => {
    const { formRef, showStates, showSetters, closeAllDropdowns, handleOpen } =
        useFilterDropdowns()

    const { patientNames, practices, obrasSociales, instituciones } =
        usePatientLists(patients)

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent): void => {
            if (formRef.current && !formRef.current.contains(event.target as Node)) {
                closeAllDropdowns()
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [formRef, closeAllDropdowns])

    const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>): void => {
        const target = e.target as HTMLElement
        if (target.closest(".autocomplete-container")) {
            return
        }
        closeAllDropdowns()
    }

    const fPatients = useMemo(() => {
        if (!selectedPatientName) return patientNames
        return patientNames.filter(n => n.toLowerCase().includes(selectedPatientName.toLowerCase()))
    }, [patientNames, selectedPatientName])

    const fPractices = useMemo(() => {
        if (!selectedPractice) return practices
        return practices.filter(n => n.toLowerCase().includes(selectedPractice.toLowerCase()))
    }, [practices, selectedPractice])

    const fObrasSociales = useMemo(() => {
        if (!selectedObraSocial) return obrasSociales
        return obrasSociales.filter(n => n.toLowerCase().includes(selectedObraSocial.toLowerCase()))
    }, [obrasSociales, selectedObraSocial])

    const fInstituciones = useMemo(() => {
        if (!selectedInstitucion) return instituciones
        return instituciones.filter(n => n.toLowerCase().includes(selectedInstitucion.toLowerCase()))
    }, [instituciones, selectedInstitucion])

    const hPatientClick = useCallback((n: string) => { 
        setSelectedPatientName(n) 
        closeAllDropdowns() 
    }, [setSelectedPatientName, closeAllDropdowns])

    const hPracticeClick = useCallback((n: string) => { 
        setSelectedPractice(n) 
        closeAllDropdowns() 
    }, [setSelectedPractice, closeAllDropdowns])

    const hOSClick = useCallback((n: string) => { 
        setSelectedObraSocial(n) 
        closeAllDropdowns() 
    }, [setSelectedObraSocial, closeAllDropdowns])

    const hInstiClick = useCallback((n: string) => { 
        setSelectedInstitucion(n) 
        closeAllDropdowns() 
    }, [setSelectedInstitucion, closeAllDropdowns])

    const handleResetFilters = () => {
        setSelectedDateFrom("") 
        setSelectedDateTo("") 
        setSelectedPatientName("")
        setSelectedPractice("") 
        setSelectedObraSocial("") 
        setSelectedInstitucion("")
        setSelectedStatus("") 
        closeAllDropdowns()
    }

    return (
        <div 
            ref={formRef} 
            onClick={handleContainerClick}
            className="bg-[#0F2A35] p-4 md:p-6 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] w-full border border-[#1f3b47] relative z-20"
        >
            <style>
                {`
                    .react-datepicker__portal {
                        z-index: 99999 !important;
                    }
                    .react-datepicker-popper {
                        z-index: 99999 !important;
                    }
                    .react-datepicker-wrapper {
                        width: 100%;
                    }
                    .react-datepicker {
                        background-color: #0F2A35 !important;
                        border: 1px solid #1f3b47 !important;
                        border-radius: 12px !important;
                        overflow: hidden;
                        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3) !important;
                    }
                    .react-datepicker__header {
                        background-color: #1a3a4a !important;
                        border-bottom: 1px solid #1f3b47 !important;
                    }
                    .react-datepicker__current-month, .react-datepicker__day-name, .react-datepicker__day {
                        color: #e2e8f0 !important;
                    }
                    .react-datepicker__day:hover {
                        background-color: #0891b2 !important;
                        border-radius: 6px !important;
                    }
                    .react-datepicker__day--selected {
                        background-color: #06b6d4 !important;
                        border-radius: 6px !important;
                    }
                `}
            </style>
            
            <div className="flex items-center justify-between mb-6 text-white border-b border-[#1f3b47] pb-4">
                <div className="flex items-center">
                    <div className="bg-[#1a3a4a] p-2 rounded-lg mr-3">
                        <FaFilter className="text-cyan-400 text-lg" />
                    </div>
                    <h3 className="font-black text-lg md:text-xl tracking-tighter uppercase italic">Panel de Filtros</h3>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 items-end">
                <div className="flex flex-col w-full relative">
                    <label className="text-[11px] uppercase font-black text-cyan-500/70 mb-1.5 ml-1 tracking-widest">Desde</label>
                    <div className="relative group">
                        <DatePicker
                            selected={parseISO(selectedDateFrom)}
                            onChange={(d: Date | null) => setSelectedDateFrom(parseDatePickerValue(d))}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="DD/MM/AAAA"
                            className="p-2.5 bg-[#1a3a4a]/50 border border-[#2d4a57] rounded-xl text-sm text-white w-full h-11 focus:border-cyan-500 focus:bg-[#1a3a4a] transition-all duration-300 outline-none pr-9 shadow-inner"
                            wrapperClassName="w-full"
                            portalId="root-portal"
                        />
                        {selectedDateFrom && (
                            <button onClick={() => setSelectedDateFrom("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors">
                                <FaTimesCircle size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col w-full relative">
                    <label className="text-[11px] uppercase font-black text-cyan-500/70 mb-1.5 ml-1 tracking-widest">Hasta</label>
                    <div className="relative group">
                        <DatePicker
                            selected={parseISO(selectedDateTo)}
                            onChange={(d: Date | null) => setSelectedDateTo(parseDatePickerValue(d))}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="DD/MM/AAAA"
                            className="p-2.5 bg-[#1a3a4a]/50 border border-[#2d4a57] rounded-xl text-sm text-white w-full h-11 focus:border-cyan-500 focus:bg-[#1a3a4a] transition-all duration-300 outline-none pr-9 shadow-inner"
                            wrapperClassName="w-full"
                            portalId="root-portal"
                        />
                        {selectedDateTo && (
                            <button onClick={() => setSelectedDateTo("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors">
                                <FaTimesCircle size={16} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="autocomplete-container w-full">
                    <AutocompleteInput
                        label="Paciente"
                        value={selectedPatientName}
                        setValue={setSelectedPatientName}
                        fieldKey={"patient" as FilterFieldKey}
                        filteredNames={fPatients}
                        placeholder="Buscar nombre..."
                        dataTestId="filter-paciente"
                        isShowing={showStates.patient}
                        setter={showSetters.patient}
                        handleOpen={handleOpen}
                        handleSuggestionClick={hPatientClick}
                    />
                </div>

                <div className="autocomplete-container w-full">
                    <AutocompleteInput
                        label="Práctica"
                        value={selectedPractice}
                        setValue={setSelectedPractice}
                        fieldKey={"practice" as FilterFieldKey}
                        filteredNames={fPractices}
                        placeholder="Tipo estudio..."
                        dataTestId="filter-practice"
                        isShowing={showStates.practice}
                        setter={showSetters.practice}
                        handleOpen={handleOpen}
                        handleSuggestionClick={hPracticeClick}
                    />
                </div>

                <div className="autocomplete-container w-full">
                    <AutocompleteInput
                        label="Obra Social"
                        value={selectedObraSocial}
                        setValue={setSelectedObraSocial}
                        fieldKey={"obraSocial" as FilterFieldKey}
                        filteredNames={fObrasSociales}
                        placeholder="Entidad OS..."
                        dataTestId="filter-obrasocial"
                        isShowing={showStates.obraSocial}
                        setter={showSetters.obraSocial}
                        handleOpen={handleOpen}
                        handleSuggestionClick={hOSClick}
                    />
                </div>

                <div className="autocomplete-container w-full">
                    <AutocompleteInput
                        label="Institución"
                        value={selectedInstitucion}
                        setValue={setSelectedInstitucion}
                        fieldKey={"institucion" as FilterFieldKey}
                        filteredNames={fInstituciones}
                        placeholder="Sede / Centro..."
                        dataTestId="filter-institucion"
                        isShowing={showStates.institucion}
                        setter={showSetters.institucion}
                        handleOpen={handleOpen}
                        handleSuggestionClick={hInstiClick}
                    />
                </div>

                <div className="flex flex-col w-full relative">
                    <label className="text-[11px] uppercase font-black text-cyan-500/70 mb-1.5 ml-1 tracking-widest">Estado</label>
                    <div className="relative">
                        <select
                            value={selectedStatus}
                            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
                            className="p-2.5 border border-[#2d4a57] bg-[#1a3a4a]/50 rounded-xl text-sm text-white w-full h-11 appearance-none focus:border-cyan-500 focus:bg-[#1a3a4a] transition-all duration-300 outline-none cursor-pointer pr-10 shadow-inner"
                        >
                            <option value="" className="bg-[#0F2A35]">Todos</option>
                            <option value="Pagado" className="bg-[#0F2A35]">Pagado</option>
                            <option value="No Pagado" className="bg-[#0F2A35]">No Pagado</option>
                        </select>
                        <FaChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none size-3" />
                    </div>
                </div>
        
                <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex items-center justify-center p-2.5 h-11 w-full bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-black rounded-xl transition-all duration-300 sm:col-span-2 lg:col-span-1 xl:col-span-1 uppercase text-[10px] tracking-widest active:scale-95 shadow-lg shadow-red-900/20"
                >
                    <FaRedo className="mr-2 text-xs" /> Limpiar
                </button>
            </div>
        </div>
    )
}

export default FilterForm