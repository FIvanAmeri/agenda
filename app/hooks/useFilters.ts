import { useState } from "react";

export function useFilters() {
    const [selectedDateFrom, setSelectedDateFrom] = useState("");
    const [selectedDateTo, setSelectedDateTo] = useState("");
    const [selectedPatientName, setSelectedPatientName] = useState("");
    const [selectedPractice, setSelectedPractice] = useState("");
    const [selectedObraSocial, setSelectedObraSocial] = useState("");
    const [selectedInstitucion, setSelectedInstitucion] = useState("");
    const [selectedStatus, setSelectedStatus] = useState("");

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
        setSelectedInstitucion,
        selectedStatus,
        setSelectedStatus,
    };
}