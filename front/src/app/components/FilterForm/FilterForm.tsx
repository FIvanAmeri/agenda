"use client";

import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Patient } from "../interfaz/interfaz";
import { FaFilter, FaRedo } from "react-icons/fa";
import AutocompleteInput from "./AutocompleteInput";
import { useFilterDropdowns } from "../../hooks/Filtro/useFilterDropdowns";
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

const filterSuggestions = (list: string[], value: string) =>
  value ? list.filter((i) => i.toLowerCase().includes(value.toLowerCase())) : list;

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
  patients,
}) => {
  const { formRef, showStates, showSetters, closeAllDropdowns, handleOpen } =
    useFilterDropdowns();

  const { patientNames, practices, obrasSociales, instituciones } =
    usePatientLists(patients);

  const handleSuggestionClick = (
    name: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setValue(name);
    closeAllDropdowns();
  };

  const handleResetFilters = () => {
    setSelectedDateFrom("");
    setSelectedDateTo("");
    setSelectedPatientName("");
    setSelectedPractice("");
    setSelectedObraSocial("");
    setSelectedInstitucion("");
    closeAllDropdowns();
  };

  return (
    <div ref={formRef} className="bg-gray-800 p-5 rounded-xl shadow-2xl">
      <div className="flex items-center mb-4 text-white border-b border-gray-600 pb-3">
        <FaFilter className="mr-3 text-green-400 text-xl" />
        <h3 className="font-extrabold text-xl tracking-wide">Opciones de Filtrado</h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 xl:grid-cols-7 gap-4 items-end">
        
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-400 mb-1">Desde</label>
          <DatePicker
            selected={parseISO(selectedDateFrom)}
            onChange={(d) => setSelectedDateFrom(parseDatePickerValue(d))}
            dateFormat="dd/MM/yyyy"
            placeholderText="DD/MM/AAAA"
            className="p-2 border border-gray-600 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner w-full h-10"
            wrapperClassName="w-full"
          />
        </div>

   
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-400 mb-1">Hasta</label>
          <DatePicker
            selected={parseISO(selectedDateTo)}
            onChange={(d) => setSelectedDateTo(parseDatePickerValue(d))}
            dateFormat="dd/MM/yyyy"
            placeholderText="DD/MM/AAAA"
            className="p-2 border border-gray-600 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-400 shadow-inner w-full h-10"
            wrapperClassName="w-full"
          />
        </div>

        <AutocompleteInput
          label="Paciente"
          value={selectedPatientName}
          setValue={setSelectedPatientName}
          fieldKey="patient"
          filteredNames={filterSuggestions(patientNames, selectedPatientName)}
          placeholder="Escriba o seleccione paciente..."
          dataTestId="filter-paciente"
          isShowing={showStates.patient}
          setter={showSetters.patient}
          handleOpen={handleOpen}
          handleSuggestionClick={handleSuggestionClick}
        />

        <AutocompleteInput
          label="Práctica"
          value={selectedPractice}
          setValue={setSelectedPractice}
          fieldKey="practice"
          filteredNames={filterSuggestions(practices, selectedPractice)}
          placeholder="Escriba o seleccione práctica..."
          dataTestId="filter-practice"
          isShowing={showStates.practice}
          setter={showSetters.practice}
          handleOpen={handleOpen}
          handleSuggestionClick={handleSuggestionClick}
        />

        <AutocompleteInput
          label="Obra Social"
          value={selectedObraSocial}
          setValue={setSelectedObraSocial}
          fieldKey="obraSocial"
          filteredNames={filterSuggestions(obrasSociales, selectedObraSocial)}
          placeholder="Escriba o seleccione obra social..."
          dataTestId="filter-obrasocial"
          isShowing={showStates.obraSocial}
          setter={showSetters.obraSocial}
          handleOpen={handleOpen}
          handleSuggestionClick={handleSuggestionClick}
        />

        <AutocompleteInput
          label="Institución"
          value={selectedInstitucion}
          setValue={setSelectedInstitucion}
          fieldKey="institucion"
          filteredNames={filterSuggestions(instituciones, selectedInstitucion)}
          placeholder="Escriba o seleccione institución..."
          dataTestId="filter-institucion"
          isShowing={showStates.institucion}
          setter={showSetters.institucion}
          handleOpen={handleOpen}
          handleSuggestionClick={handleSuggestionClick}
        />

  
        <button
          type="button"
          onClick={handleResetFilters}
          className="flex items-center justify-center p-2 h-10 w-full mt-4 lg:mt-0 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 transform hover:scale-[1.02]"
        >
          <FaRedo className="mr-1" />
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default FilterForm;