"use client";

import React from "react";
import { Patient } from "../interfaz/interfaz";
import { FaFilter, FaRedo } from "react-icons/fa";

import AutocompleteInput from "./AutocompleteInput";
import { useFilterDropdowns } from "../../hooks/Filtro/useFilterDropdowns";
import { usePatientLists } from "../../hooks/Filtro/usePatientLists";

interface FilterFormProps {
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
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

const FilterForm: React.FC<FilterFormProps> = ({
  selectedDate,
  setSelectedDate,
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
  const {
    formRef,
    showStates,
    showSetters,
    closeAllDropdowns,
    handleOpen,
  } = useFilterDropdowns();

  const { patientNames, practices, obrasSociales, instituciones } =
    usePatientLists(patients);

  const filterSuggestions = (list: string[], value: string) =>
    value ? list.filter((i) => i.toLowerCase().includes(value.toLowerCase())) : list;

  const handleSuggestionClick = (
    name: string,
    setValue: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setValue(name);
    closeAllDropdowns();
  };

  const handleResetFilters = () => {
    setSelectedDate("");
    setSelectedPatientName("");
    setSelectedPractice("");
    setSelectedObraSocial("");
    setSelectedInstitucion("");
    closeAllDropdowns();
  };

  return (
    <div ref={formRef} className="bg-gray-700 p-4 rounded-lg shadow-xl border border-gray-600">
      <div className="flex items-center mb-3 text-white">
        <FaFilter className="mr-2 text-green-400" />
        <h3 className="font-semibold text-lg">Opciones de Filtrado</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
        <div className="flex flex-col">
          <label className="text-xs font-medium text-gray-300 mb-1">Fecha</label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-2 border border-gray-500 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-500"
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
          className="flex items-center justify-center p-2 mt-4 lg:mt-0 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          <FaRedo className="mr-1" />
          Limpiar
        </button>
      </div>
    </div>
  );
};

export default FilterForm;
