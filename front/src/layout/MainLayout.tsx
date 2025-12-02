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

const API_USERS = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api/users";

function parseJwt(token: string): { [key: string]: unknown } | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = parts[1];
        const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, "=");
        const decoded = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decoded);
    } catch {
        return null;
    }
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const router = useRouter();
    const { token, loading: authLoading } = useAuth();

    const [user, setUser] = useState<User | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [showCirugiaModal, setShowCirugiaModal] = useState(false);
    const [showViewCirugiaModal, setShowViewCirugiaModal] = useState(false);
    const [selectedCirugia, setSelectedCirugia] = useState<Cirugia | null>(null);

    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try {
                setUser(JSON.parse(stored) as User);
            } catch {
                localStorage.removeItem("user");
            }
        }
    }, []);

    useEffect(() => {
        async function fetchUserFromApi(decodedId: number, t: string) {
            try {
                const res = await fetch(`${API_USERS}/${decodedId}`, {
                    headers: { Authorization: `Bearer ${t}` }
                });
                if (!res.ok) return;
                const data = await res.json();
                const fetchedUser = data.user ?? data;
                if (fetchedUser) {
                    localStorage.setItem("user", JSON.stringify(fetchedUser));
                    setUser(fetchedUser as User);
                }
            } catch {
            }
        }

        if (!user && token) {
            const payload = parseJwt(token);
            const maybeId = payload && (payload["userId"] ?? payload["usuarioId"] ?? payload["id"]);
            const idNumber = typeof maybeId === "number" ? maybeId : typeof maybeId === "string" && /^\d+$/.test(maybeId) ? Number(maybeId) : null;
            if (idNumber) {
                fetchUserFromApi(idNumber, token);
            }
        }
    }, [token, user]);

    useEffect(() => {
        if (!authLoading && !token) {
            router.replace("/");
        }
    }, [authLoading, token, router]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/");
    };

    if (authLoading) return <div className="text-center text-gray-300 mt-10">Cargando...</div>;

    if (!token) return null;

    if (!user) return <div className="text-center text-gray-300 mt-10">Cargando usuario...</div>;

    return (
        <div className="flex bg-cyan-900 min-h-screen">
            <Sidebar
                handleLogout={handleLogout}
                setShowAddModal={setShowAddModal}
                setShowCirugiaModal={setShowCirugiaModal}
                userName={user.usuario}
            />

            <main className="flex-1 ml-64 p-0">
                {children({
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
                    setSelectedCirugia
                })}
            </main>
        </div>
    );
};

export default MainLayout;
