import { useState } from "react";

export const useFilters = () => {
  const [selectedDateFrom, setSelectedDateFrom] = useState("");
  const [selectedDateTo, setSelectedDateTo] = useState("");
  const [selectedPatientName, setSelectedPatientName] = useState("");
  const [selectedPractice, setSelectedPractice] = useState("");
  const [selectedObraSocial, setSelectedObraSocial] = useState("");
  const [selectedInstitucion, setSelectedInstitucion] = useState("");

  return {
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
    setSelectedInstitucion
  };
};
