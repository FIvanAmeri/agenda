"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import MainLayout from "../../layout/MainLayout";
import PrincipalContent from "../components/content/PrincipalContent";
import VerCirugiasContent from "../components/VerCirugia/VerCirugiasContent";
import AddCirugiaModal from "../components/Cirugia/AddCirugiaModal";
import CirugiaDetailModal from "../components/Cirugia/CirugiaDetailModal";
import AddPatientModal from "../components/Modals/AddPatientModal"; 
import EstadisticasDetalle from "../components/Estadisticas/EstadisticasDetalle";

export default function PrincipalPage() {
    const searchParams = useSearchParams();
    const currentView = searchParams.get("view");
    const isCirugiasView = currentView === "cirugias";
    const isEstadisticasView = currentView === "estadisticas";

    const [cirugiaRefreshKey, setCirugiaRefreshKey] = React.useState(0);

    const handleCirugiaAddedSuccess = (setShowCirugiaModal: (show: boolean) => void) => {
        setShowCirugiaModal(false); 
        setCirugiaRefreshKey(prev => prev + 1); 
    };

    const renderContent = (props: any) => {
        if (isEstadisticasView) {
            return <EstadisticasDetalle />;
        }
        
        if (isCirugiasView) {
            return (
                <VerCirugiasContent 
                    user={props.user} 
                    key={cirugiaRefreshKey}
                />
            );
        }

        return (
            <PrincipalContent 
                user={props.user} 
                showAddModal={props.showAddModal}
                setShowAddModal={props.setShowAddModal}
                showEditModal={props.showEditModal}
                setShowEditModal={props.setShowEditModal}
                selectedPatient={props.selectedPatient}
                setSelectedPatient={props.setSelectedPatient}
            />
        );
    };

    return (
        <MainLayout>
            {(props) => {
                if (!props.user) return null;

                return (
                    <>
                        {renderContent(props)}

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

                        {props.showViewCirugiaModal &&
                            props.selectedCirugia && (
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