import { useState } from "react";

const useFilters = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedPatientName, setSelectedPatientName] = useState<string>("");
  const [selectedPractice, setSelectedPractice] = useState<string>("");
  const [selectedObraSocial, setSelectedObraSocial] = useState<string>("");
  const [selectedInstitucion, setSelectedInstitucion] = useState<string>("");


  const resetFilters = () => {
    setSelectedDate("");
    setSelectedPatientName("");
    setSelectedPractice("");
    setSelectedObraSocial("");
    setSelectedInstitucion("");
  };

  return {
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
    resetFilters,
  };
};

export default useFilters;
