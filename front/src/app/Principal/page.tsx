"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import MainLayout from "../../layout/MainLayout";
import PrincipalContent from "../components/content/PrincipalContent";
import VerCirugiasContent from "../components/VerCirugia/VerCirugiasContent";
import AddCirugiaModal from "../components/Cirugia/AddCirugiaModal";
import CirugiaDetailModal from "../components/Cirugia/CirugiaDetailModal";
import AddPatientModal from "../components/Modals/AddPatientModal"; 

export default function PrincipalPage() {
    const searchParams = useSearchParams();
    const currentView = searchParams.get("view");
    const isCirugiasView = currentView === "cirugias";

    return (
        <MainLayout>
            {(props) => {
                if (!props.user) return null;

                return (
                    <>
                        {isCirugiasView ? (
                            <VerCirugiasContent user={props.user} />
                        ) : (
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
                                onAdded={() => props.setShowCirugiaModal(false)}
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