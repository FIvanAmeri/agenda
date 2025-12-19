"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import MainLayout from "../../layout/MainLayout";
import PrincipalContent from "../components/content/PrincipalContent";
import VerCirugiasContent from "../components/VerCirugia/VerCirugiasContent";
import { FormularioCamposCirugia } from "../components/Cirugia/FormularioCamposCirugia";
import CirugiaDetailModal from "../components/Cirugia/CirugiaDetailModal";
import AddPatientModal from "../components/Modals/AddPatientModal"; 
import EstadisticasDetalle from "../components/Estadisticas/EstadisticasDetalle";
import { User, Patient, Cirugia, FiltrosCirugia } from "../components/interfaz/interfaz";
import usePatients from "../hooks/usePatients";
import { useCirugias } from "../hooks/Cirugia/useCirugiaData";

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

const initialFilters: FiltrosCirugia = {
    dateFrom: "",
    dateTo: "",
    selectedPatientName: "",
    selectedTipoCirugia: "",
    selectedMedico: "",
    selectedStatus: "",
    selectedObraSocial: "",
};

export default function PrincipalPage(): JSX.Element {
    const searchParams = useSearchParams();
    const currentView: string | null = searchParams.get("view");
    const isCirugiasView: boolean = currentView === "cirugias";
    const isEstadisticasView: boolean = currentView === "estadisticas";

    const [cirugiaRefreshKey, setCirugiaRefreshKey] = useState<number>(0);
    const [patientRefreshKey, setPatientRefreshKey] = useState<number>(0);

    const { patients, setPatients } = usePatients();
    
    const [userContext, setUserContext] = useState<User | null>(null);

    const { allCirugias } = useCirugias(userContext, initialFilters, cirugiaRefreshKey);

    const combinedPatientsForSuggestions: Patient[] = useMemo((): Patient[] => {
        const patientList: Patient[] = Array.isArray(patients) ? patients : [];
        const cirugiaList: Cirugia[] = Array.isArray(allCirugias) ? allCirugias : [];
        
        const map: Map<string, Patient> = new Map<string, Patient>();
        
        patientList.forEach((p: Patient): void => {
            if (p.paciente) map.set(p.paciente.toLowerCase().trim(), p);
        });
        
        cirugiaList.forEach((c: Cirugia): void => {
            const name: string | undefined = c.paciente?.toLowerCase().trim();
            if (name && !map.has(name)) {
                map.set(name, {
                    id: c.id,
                    paciente: c.paciente,
                    dia: c.fecha,
                    hora: "",
                    practicas: c.tipoCirugia,
                    obraSocial: c.obraSocial || "",
                    institucion: "",
                    estadoPago: "no pagado"
                } as Patient);
            }
        });
        
        return Array.from(map.values());
    }, [patients, allCirugias]);

    const handleCirugiaAddedSuccess = useCallback((setShowCirugiaModal: (show: boolean) => void): void => {
        setShowCirugiaModal(false); 
        setCirugiaRefreshKey((prev: number): number => prev + 1); 
    }, []);

    const handlePatientAddedSuccess = useCallback((newPatient: Patient, setShowAddModal: (show: boolean) => void): void => {
        setPatients((prev: Patient[]): Patient[] => {
            const list: Patient[] = Array.isArray(prev) ? prev : [];
            return [...list, newPatient].sort((a: Patient, b: Patient): number => {
                const dateA: number = new Date(a.dia).getTime();
                const dateB: number = new Date(b.dia).getTime();
                if (dateA !== dateB) return dateA - dateB;
                return a.hora.localeCompare(b.hora);
            });
        });
        setShowAddModal(false);
        setPatientRefreshKey((prev: number): number => prev + 1);
    }, [setPatients]);

    return (
        <MainLayout>
            {(props: MainLayoutProps): JSX.Element | null => {
                if (!props.user) return null;
                
                if (!userContext || userContext.id !== props.user.id) {
                    setUserContext(props.user);
                }

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
                                onClose={(): void => props.setShowAddModal(false)}
                                onAdd={(newPatient: Patient): void => handlePatientAddedSuccess(newPatient, props.setShowAddModal)}
                                existingPatients={combinedPatientsForSuggestions}
                            />
                        )}

                        {props.showCirugiaModal && (
                            <FormularioCamposCirugia
                                user={props.user}
                                onClose={(): void => props.setShowCirugiaModal(false)}
                                onAdded={(): void => handleCirugiaAddedSuccess(props.setShowCirugiaModal)}
                                existingPatients={combinedPatientsForSuggestions}
                            />
                        )}

                        {props.showViewCirugiaModal && props.selectedCirugia && (
                            <CirugiaDetailModal
                                cirugia={props.selectedCirugia}
                                onClose={(): void => {
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