"use client";

import React, { useCallback, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Patient } from "../interfaz/interfaz";
import { FaFilter, FaRedo } from "react-icons/fa";
import AutocompleteInput from "./AutocompleteInput";
import { useFilterDropdowns, FilterFieldKey } from "../../hooks/Filtro/useFilterDropdowns";
import { usePatientLists } from "../../hooks/Filtro/usePatientLists";

interface FilterFormProps {
    selectedDateFrom: string;
    setSelectedDateFrom: React.Dispatch<React.SetStateAction<string>>;
    selectedDateTo: string;
    setSelectedDateTo: React.Dispatch<React.SetStateAction<string>>;
    selectedPatientName: string;
    setSelectedPatientName: React.Dispatch<React.SetStateAction<string>>;
    selectedPractice: string;
    setSelectedPractice: React.Dispatch<React.SetStateAction<string>>;
    selectedObraSocial: string;
    setSelectedObraSocial: React.Dispatch<React.SetStateAction<string>>;
    selectedInstitucion: string;
    setSelectedInstitucion: React.Dispatch<React.SetStateAction<string>>;
    selectedStatus: string;
    setSelectedStatus: React.Dispatch<React.SetStateAction<string>>;
    patients: Patient[];
}

const formatISO = (date: Date | null): string => {
    if (!date) return "";
    const d = date.getDate().toString().padStart(2, "0");
    const m = (date.getMonth() + 1).toString().padStart(2, "0");
    const y = date.getFullYear();
    return `${y}-${m}-${d}`;
};

const parseISO = (iso: string): Date | null => {
    if (!iso) return null;
    const parts = iso.split("-");
    if (parts.length !== 3) return new Date(iso);
    const y = Number(parts[0]);
    const m = Number(parts[1]) - 1;
    const d = Number(parts[2]);
    return new Date(y, m, d);
};

const parseDatePickerValue = (date: Date | null): string => {
    return formatISO(date);
};

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
        useFilterDropdowns();

    const { patientNames, practices, obrasSociales, instituciones } =
        usePatientLists(patients);

    const fPatients = useMemo(() => 
        patientNames.filter(n => n.toLowerCase().includes(selectedPatientName.toLowerCase())),
        [patientNames, selectedPatientName]
    );

    const fPractices = useMemo(() => 
        practices.filter(n => n.toLowerCase().includes(selectedPractice.toLowerCase())),
        [practices, selectedPractice]
    );

    const fObrasSociales = useMemo(() => 
        obrasSociales.filter(n => n.toLowerCase().includes(selectedObraSocial.toLowerCase())),
        [obrasSociales, selectedObraSocial]
    );

    const fInstituciones = useMemo(() => 
        instituciones.filter(n => n.toLowerCase().includes(selectedInstitucion.toLowerCase())),
        [instituciones, selectedInstitucion]
    );

    const hPatientClick = useCallback((n: string) => { setSelectedPatientName(n); closeAllDropdowns(); }, [setSelectedPatientName, closeAllDropdowns]);
    const hPracticeClick = useCallback((n: string) => { setSelectedPractice(n); closeAllDropdowns(); }, [setSelectedPractice, closeAllDropdowns]);
    const hOSClick = useCallback((n: string) => { setSelectedObraSocial(n); closeAllDropdowns(); }, [setSelectedObraSocial, closeAllDropdowns]);
    const hInstiClick = useCallback((n: string) => { setSelectedInstitucion(n); closeAllDropdowns(); }, [setSelectedInstitucion, closeAllDropdowns]);

    const handleResetFilters = () => {
        setSelectedDateFrom(""); setSelectedDateTo(""); setSelectedPatientName("");
        setSelectedPractice(""); setSelectedObraSocial(""); setSelectedInstitucion("");
        setSelectedStatus(""); closeAllDropdowns();
    };

    return (
        <div ref={formRef} className="bg-gray-800 p-4 md:p-5 rounded-xl shadow-2xl w-full">
            <div className="flex items-center mb-4 text-white border-b border-gray-600 pb-3">
                <FaFilter className="mr-3 text-green-400 text-lg md:text-xl" />
                <h3 className="font-extrabold text-lg md:text-xl tracking-wide">Filtros de estudios</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8 gap-4 items-end">
                <div className="flex flex-col w-full">
                    <label className="text-xs font-medium text-gray-400 mb-1">Desde</label>
                    <DatePicker
                        selected={parseISO(selectedDateFrom)}
                        onChange={(d) => setSelectedDateFrom(parseDatePickerValue(d))}
                        dateFormat="dd/MM/yyyy"
                        className="p-2 border border-gray-600 rounded-lg text-sm text-black w-full h-10"
                        wrapperClassName="w-full"
                    />
                </div>

                <div className="flex flex-col w-full">
                    <label className="text-xs font-medium text-gray-400 mb-1">Hasta</label>
                    <DatePicker
                        selected={parseISO(selectedDateTo)}
                        onChange={(d) => setSelectedDateTo(parseDatePickerValue(d))}
                        dateFormat="dd/MM/yyyy"
                        className="p-2 border border-gray-600 rounded-lg text-sm text-black w-full h-10"
                        wrapperClassName="w-full"
                    />
                </div>

                <AutocompleteInput
                    label="Paciente"
                    value={selectedPatientName}
                    setValue={setSelectedPatientName}
                    fieldKey={"patient" as FilterFieldKey}
                    filteredNames={fPatients}
                    placeholder="Paciente..."
                    dataTestId="filter-paciente"
                    isShowing={showStates.patient}
                    setter={showSetters.patient}
                    handleOpen={handleOpen}
                    handleSuggestionClick={hPatientClick}
                />

                <AutocompleteInput
                    label="Práctica"
                    value={selectedPractice}
                    setValue={setSelectedPractice}
                    fieldKey={"practice" as FilterFieldKey}
                    filteredNames={fPractices}
                    placeholder="Práctica..."
                    dataTestId="filter-practice"
                    isShowing={showStates.practice}
                    setter={showSetters.practice}
                    handleOpen={handleOpen}
                    handleSuggestionClick={hPracticeClick}
                />

                <AutocompleteInput
                    label="Obra Social"
                    value={selectedObraSocial}
                    setValue={setSelectedObraSocial}
                    fieldKey={"obraSocial" as FilterFieldKey}
                    filteredNames={fObrasSociales}
                    placeholder="OS..."
                    dataTestId="filter-obrasocial"
                    isShowing={showStates.obraSocial}
                    setter={showSetters.obraSocial}
                    handleOpen={handleOpen}
                    handleSuggestionClick={hOSClick}
                />

                <AutocompleteInput
                    label="Institución"
                    value={selectedInstitucion}
                    setValue={setSelectedInstitucion}
                    fieldKey={"institucion" as FilterFieldKey}
                    filteredNames={fInstituciones}
                    placeholder="Insti..."
                    dataTestId="filter-institucion"
                    isShowing={showStates.institucion}
                    setter={showSetters.institucion}
                    handleOpen={handleOpen}
                    handleSuggestionClick={hInstiClick}
                />

                <div className="flex flex-col w-full">
                    <label className="text-xs font-medium text-gray-400 mb-1">Estado Pago</label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                        className="p-2 border border-gray-600 bg-white rounded-lg text-sm text-black w-full h-10 appearance-none"
                    >
                        <option value="" disabled hidden>Escoja una opción</option>
                        <option value="Pagado">Pagado</option>
                        <option value="No Pagado">No Pagado</option>
                    </select>
                </div>
        
                <button
                    type="button"
                    onClick={handleResetFilters}
                    className="flex items-center justify-center p-2 h-10 w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 sm:col-span-2 lg:col-span-1 xl:col-span-1"
                >
                    <FaRedo className="mr-1" /> Limpiar
                </button>
            </div>
        </div>
    );
};

export default FilterForm;