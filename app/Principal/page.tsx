"use client"

import React, { useState, useCallback, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import MainLayout from "../../layout/MainLayout"
import PrincipalContent from "../components/content/PrincipalContent"
import VerCirugiasContent from "../components/VerCirugia/VerCirugiasContent"
import { FormularioCamposCirugia } from "../components/Cirugia/FormularioCamposCirugia"
import CirugiaDetailModal from "../components/Cirugia/CirugiaDetailModal"
import AddPatientModal from "../components/Modals/AddPatientModal"
import EstadisticasDetalle from "../components/Estadisticas/EstadisticasDetalle"
import EditPatientModal from "../components/Modals/EditPatientModal"
import { User, Patient, Cirugia, FiltrosCirugia } from "../components/interfaz/interfaz"
import usePatients from "../hooks/usePatients"
import { useCirugias } from "../hooks/Cirugia/useCirugiaData"

const initialFilters: FiltrosCirugia = {
    dateFrom: "",
    dateTo: "",
    selectedPatientName: "",
    selectedTipoCirugia: "",
    selectedMedico: "",
    selectedStatus: "",
    selectedObraSocial: "",
}

export default function PrincipalPage(): JSX.Element {
    const searchParams = useSearchParams()
    const view = searchParams.get("view")

    const isCirugiasView = view === "cirugias"
    const isEstadisticasView = view === "estadisticas"

    const [user, setUser] = useState<User | null>(null)
    const [showAddModal, setShowAddModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showCirugiaModal, setShowCirugiaModal] = useState(false)
    const [showViewCirugiaModal, setShowViewCirugiaModal] = useState(false)

    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
    const [selectedCirugia, setSelectedCirugia] = useState<Cirugia | null>(null)

    const [cirugiaRefreshKey, setCirugiaRefreshKey] = useState(0)
    const [patientRefreshKey, setPatientRefreshKey] = useState(0)

    const { patients, setPatients } = usePatients()
    const { allCirugias } = useCirugias(user, initialFilters, cirugiaRefreshKey)

    useEffect(() => {
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }
    }, [])

    const combinedPatientsForSuggestions = useMemo(() => patients, [patients])

    const handlePatientAddedSuccess = useCallback((newPatient: Patient) => {
        setPatients(prev => [...prev, newPatient])
        setPatientRefreshKey(p => p + 1)
    }, [setPatients])

    const handleUpdatePatient = useCallback((updatedPatient: Patient) => {
        setPatients(prev =>
            prev.map(p => (p.id === updatedPatient.id ? updatedPatient : p))
        )
        setPatientRefreshKey(p => p + 1)
    }, [setPatients])

    if (!user) {
        return <div className="min-h-screen bg-cyan-950 flex items-center justify-center text-white font-semibold">Cargando sesión...</div>
    }

    return (
        <MainLayout
            user={user}
            showAddModal={showAddModal}
            setShowAddModal={setShowAddModal}
            setShowCirugiaModal={setShowCirugiaModal}
        >
            <div className="w-full min-h-screen bg-cyan-900 text-white">
                {isEstadisticasView && (
                    <EstadisticasDetalle
                        onSelectPatient={() => { }}
                    />
                )}

                {isCirugiasView && <VerCirugiasContent user={user} />}

                {!isEstadisticasView && !isCirugiasView && (
                    <PrincipalContent
                        user={user}
                        showAddModal={showAddModal}
                        setShowAddModal={setShowAddModal}
                        showEditModal={showEditModal}
                        setShowEditModal={setShowEditModal}
                        selectedPatient={selectedPatient}
                        setSelectedPatient={setSelectedPatient}
                        key={`content-${patientRefreshKey}`}
                    />
                )}

                {showEditModal && selectedPatient && (
                    <EditPatientModal
                        user={user}
                        selectedPatient={selectedPatient}
                        updatePatient={handleUpdatePatient}
                        setShowEditModal={setShowEditModal}
                    />
                )}

                {showAddModal && (
                    <AddPatientModal
                        user={user}
                        onClose={() => setShowAddModal(false)}
                        onAdd={handlePatientAddedSuccess}
                        existingPatients={combinedPatientsForSuggestions}
                    />
                )}

                {showCirugiaModal && (
                    <FormularioCamposCirugia
                        user={user}
                        onClose={() => setShowCirugiaModal(false)}
                        onAdded={() => setCirugiaRefreshKey(k => k + 1)}
                        existingPatients={combinedPatientsForSuggestions}
                    />
                )}

                {showViewCirugiaModal && selectedCirugia && (
                    <CirugiaDetailModal
                        cirugia={selectedCirugia}
                        onClose={() => setShowViewCirugiaModal(false)}
                        onSubmit={async () => { }}
                        medicosOpciones={[]}
                        tiposCirugiaOpciones={[]}
                        obrasSocialesOpciones={[]}
                        showHonorarios={false}
                    />
                )}
            </div>
        </MainLayout>
    )
}