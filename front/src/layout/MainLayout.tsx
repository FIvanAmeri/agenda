"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "../app/components/Sidebar";
import useAuth from "../app/hooks/useAuth";
import { User, Patient, Cirugia } from "../app/components/interfaz/interfaz";

interface ContentProps {
    user: User;
    showAddModal: boolean;
    setShowAddModal: (show: boolean) => void;
    showEditModal: boolean;
    setShowEditModal: (show: boolean) => void;
    selectedPatient: Patient | null;
    setSelectedPatient: (patient: Patient | null) => void;
    showCirugiaModal: boolean;
    setShowCirugiaModal: (show: boolean) => void;
    showViewCirugiaModal: boolean;
    setShowViewCirugiaModal: (show: boolean) => void;
    selectedCirugia: Cirugia | null;
    setSelectedCirugia: (cirugia: Cirugia | null) => void;
}

interface MainLayoutProps {
    children: (props: ContentProps) => React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const router = useRouter();
    const { token, loading } = useAuth();

    const [user, setUser] = useState<User | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [showCirugiaModal, setShowCirugiaModal] = useState(false);
    const [showViewCirugiaModal, setShowViewCirugiaModal] = useState(false);
    const [selectedCirugia, setSelectedCirugia] = useState<Cirugia | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored) as User);
    }, []);

    useEffect(() => {
        if (!token && !loading) router.replace("/");
    }, [token, loading, router]);

    if (loading || !user) {
        return <div className="text-center text-gray-300 mt-10">Cargando...</div>;
    }

    const contentProps: ContentProps = {
        user,
        showAddModal,
        setShowAddModal,
        showEditModal,
        setShowEditModal,
        selectedPatient,
        setSelectedPatient,
        showCirugiaModal,
        setShowCirugiaModal,
        showViewCirugiaModal,
        setShowViewCirugiaModal,
        selectedCirugia,
        setSelectedCirugia,
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-cyan-900 w-full overflow-x-hidden items-stretch">
            <Sidebar
                handleLogout={() => {
                    localStorage.clear();
                    router.replace("/");
                }}
                setShowAddModal={setShowAddModal}
                setShowCirugiaModal={setShowCirugiaModal}
                userName={user.usuario}
            />

            <main className="flex-1 w-full min-w-0 flex flex-col justify-start">
                <div className="w-full">
                    {children(contentProps)}
                </div>
            </main>
        </div>
    );
};

export default MainLayout;