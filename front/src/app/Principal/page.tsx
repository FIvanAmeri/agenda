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

    const handleCirugiaAddedSuccess = useCallback((setShowCirugiaModal: (show: boolean) => void) => {
        setShowCirugiaModal(false); 
        setCirugiaRefreshKey(prev => prev + 1); 
    }, []);

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
                            />
                        )}

                        {props.showAddModal && (
                            <AddPatientModal
                                user={props.user}
                                onClose={() => props.setShowAddModal(false)}
                                onAdd={() => props.setShowAddModal(false)} 
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