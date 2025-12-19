"use client";

import React, { useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import MainLayout from "../../layout/MainLayout";
import PrincipalContent from "../components/content/PrincipalContent";
import VerCirugiasContent from "../components/VerCirugia/VerCirugiasContent";
import AddCirugiaModal from "../components/Cirugia/AddCirugiaModal";
import CirugiaDetailModal from "../components/Cirugia/CirugiaDetailModal";
import AddPatientModal from "../components/Modals/AddPatientModal"; 
import EstadisticasDetalle from "../components/Estadisticas/EstadisticasDetalle";
import { User, Patient, Cirugia } from "../components/interfaz/interfaz";
import usePatients from "../hooks/usePatients";

interface MainLayoutProps {
    user: User; 
    showAddModal: boolean;
    setShowAddModal: (show: boolean) => void;
    showEditModal: boolean;
    setShowEditModal: (show: boolean) => void;
    showCirugiaModal: boolean;
    setShowCirugiaModal: (show: boolean) => void;
    showViewCirugiaModal: boolean;
    setShowViewCirugiaModal: (show: boolean) => void;
    selectedPatient: Patient | null;
    setSelectedPatient: (patient: Patient | null) => void;
    selectedCirugia: Cirugia | null;
    setSelectedCirugia: (cirugia: Cirugia | null) => void;
}

export default function PrincipalPage() {
    const searchParams = useSearchParams();
    const currentView = searchParams.get("view");
    const isCirugiasView = currentView === "cirugias";
    const isEstadisticasView = currentView === "estadisticas";

    const [cirugiaRefreshKey, setCirugiaRefreshKey] = useState(0);
    const [patientRefreshKey, setPatientRefreshKey] = useState(0);

    const { patients, setPatients } = usePatients();

    const handleCirugiaAddedSuccess = useCallback((setShowCirugiaModal: (show: boolean) => void) => {
        setShowCirugiaModal(false); 
        setCirugiaRefreshKey(prev => prev + 1); 
    }, []);

    const handlePatientAddedSuccess = useCallback((newPatient: Patient, setShowAddModal: (show: boolean) => void) => {
        setPatients((prev) => {
            const list = Array.isArray(prev) ? prev : [];
            return [...list, newPatient].sort((a, b) => {
                const dateA = new Date(a.dia).getTime();
                const dateB = new Date(b.dia).getTime();
                if (dateA !== dateB) return dateA - dateB;
                return a.hora.localeCompare(b.hora);
            });
        });
        setShowAddModal(false);
        setPatientRefreshKey(prev => prev + 1);
    }, [setPatients]);

    return (
        <MainLayout>
            {(props: MainLayoutProps) => {
                if (!props.user) return null;

                return (
                    <>
                        {isEstadisticasView && <EstadisticasDetalle />}
                        
                        {isCirugiasView && (
                            <VerCirugiasContent 
                                user={props.user} 
                                key={`cirugia-view-${cirugiaRefreshKey}`}
                            />
                        )}

                        {!isEstadisticasView && !isCirugiasView && (
                            <PrincipalContent 
                                user={props.user} 
                                showAddModal={props.showAddModal}
                                setShowAddModal={props.setShowAddModal}
                                showEditModal={props.showEditModal}
                                setShowEditModal={props.setShowEditModal}
                                selectedPatient={props.selectedPatient}
                                setSelectedPatient={props.setSelectedPatient}
                                key={`patient-content-${patientRefreshKey}`}
                            />
                        )}

                        {props.showAddModal && (
                            <AddPatientModal
                                user={props.user}
                                onClose={() => props.setShowAddModal(false)}
                                onAdd={(newPatient: Patient) => handlePatientAddedSuccess(newPatient, props.setShowAddModal)}
                                existingPatients={Array.isArray(patients) ? patients : []}
                            />
                        )}

                        {props.showCirugiaModal && (
                            <AddCirugiaModal
                                user={props.user}
                                onClose={() => props.setShowCirugiaModal(false)}
                                onAdded={() => handleCirugiaAddedSuccess(props.setShowCirugiaModal)}
                            />
                        )}

                        {props.showViewCirugiaModal && props.selectedCirugia && (
                            <CirugiaDetailModal
                                cirugia={props.selectedCirugia}
                                onClose={() => {
                                    props.setShowViewCirugiaModal(false);
                                    props.setSelectedCirugia(null);
                                }}
                                showHonorarios={false}
                            />
                        )}
                    </>
                );
            }}
        </MainLayout>
    );
}