"use client"

import React, { useCallback, useMemo, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { Patient } from "../interfaz/interfaz"
import { FaFilter, FaRedo, FaTimesCircle } from "react-icons/fa"
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
        if (target.closest('.autocomplete-container')) {
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
            className="bg-[#0F2A35] p-4 md:p-5 rounded-xl shadow-2xl w-full border border-[#1f3b47] relative z-20"
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
                        border-color: #1f3b47 !important;
                        color: white !important;
                    }
                    .react-datepicker__header {
                        background-color: #164e63 !important;
                        border-bottom-color: #1f3b47 !important;
                    }
                    .react-datepicker__current-month, .react-datepicker__day-name, .react-datepicker__day {
                        color: white !important;
                    }
                    .react-datepicker__day:hover {
                        background-color: #0891b2 !important;
                    }
                    .react-datepicker__day--selected {
                        background-color: #06b6d4 !important;
                    }
                `}
            </style>
            
            <div className="flex items-center mb-4 text-white border-b border-[#1f3b47] pb-3">
                <FaFilter className="mr-3 text-cyan-400 text-lg md:text-xl" />
                <h3 className="font-extrabold text-lg md:text-xl tracking-wide uppercase">Filtros de búsqueda</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-3 items-end">
                <div className="flex flex-col w-full relative">
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 ml-1">Desde</label>
                    <div className="relative">
                        <DatePicker
                            selected={parseISO(selectedDateFrom)}
                            onChange={(d: Date | null) => setSelectedDateFrom(parseDatePickerValue(d))}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="DD/MM/AAAA"
                            className="p-2 bg-[#1a3a4a] border border-gray-600 rounded-lg text-sm text-white w-full h-10 focus:ring-2 focus:ring-cyan-500 outline-none pr-8"
                            wrapperClassName="w-full"
                            portalId="root-portal"
                        />
                        {selectedDateFrom && (
                            <button onClick={() => setSelectedDateFrom("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700">
                                <FaTimesCircle size={14} />
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col w-full relative">
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 ml-1">Hasta</label>
                    <div className="relative">
                        <DatePicker
                            selected={parseISO(selectedDateTo)}
                            onChange={(d: Date | null) => setSelectedDateTo(parseDatePickerValue(d))}
                            dateFormat="dd/MM/yyyy"
                            placeholderText="DD/MM/AAAA"
                            className="p-2 bg-[#1a3a4a] border border-gray-600 rounded-lg text-sm text-white w-full h-10 focus:ring-2 focus:ring-cyan-500 outline-none pr-8"
                            wrapperClassName="w-full"
                            portalId="root-portal"
                        />
                        {selectedDateTo && (
                            <button onClick={() => setSelectedDateTo("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500 hover:text-red-700">
                                <FaTimesCircle size={14} />
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
                        placeholder="Nombre..."
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
                        placeholder="Estudio..."
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
                        placeholder="Entidad..."
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
                        placeholder="Lugar..."
                        dataTestId="filter-institucion"
                        isShowing={showStates.institucion}
                        setter={showSetters.institucion}
                        handleOpen={handleOpen}
                        handleSuggestionClick={hInstiClick}
                    />
                </div>

                <div className="flex flex-col w-full">
                    <label className="text-[10px] uppercase font-bold text-gray-400 mb-1 ml-1">Estado</label>
                    <select
                        value={selectedStatus}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedStatus(e.target.value)}
                        className="p-2 border border-gray-600 bg-[#1a3a4a] rounded-lg text-sm text-white w-full h-10 appearance-none focus:ring-2 focus:ring-cyan-500 outline-none cursor-pointer"
                    >
                        <option value="" className="bg-[#0F2A35]">Todos</option>
                        <option value="Pagado" className="bg-[#0F2A35]">Pagado</option>
                        <option value="No Pagado" className="bg-[#0F2A35]">No Pagado</option>
                    </select>
                </div>
        
                <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex items-center justify-center p-2 h-10 w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg transition duration-200 sm:col-span-2 lg:col-span-1 xl:col-span-1 uppercase text-xs"
                >
                    <FaRedo className="mr-2" /> Limpiar
                </button>
            </div>
        </div>
    )
}

export default FilterForm