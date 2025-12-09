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

function parseJwt(token: string): Record<string, unknown> | null {
    try {
        const parts = token.split(".");
        if (parts.length !== 3) return null;
        const payload = parts[1];
        const padded = payload.padEnd(payload.length + (4 - (payload.length % 4)) % 4, "=");
        const decoded = atob(padded.replace(/-/g, "+").replace(/_/g, "/"));
        return JSON.parse(decoded) as Record<string, unknown>;
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
        const t = token || localStorage.getItem("token");
        if (!t) {
            router.replace("/");
            return;
        }

        const decoded = parseJwt(t);
        const exp = typeof decoded?.exp === "number" ? decoded.exp : null;

        if (!exp || exp * 1000 < Date.now()) {
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            router.replace("/");
        }
    }, [authLoading, token, router]);

    useEffect(() => {
        async function fetchUser(decodedId: number, t: string) {
            const res = await fetch(`${API_USERS}/${decodedId}`, {
                headers: { Authorization: `Bearer ${t}` }
            });
            if (!res.ok) return;
            const data = await res.json();
            const fetchedUser = data.user ?? data;
            setUser(fetchedUser as User);
            localStorage.setItem("user", JSON.stringify(fetchedUser));
        }

        const t = token || localStorage.getItem("token");
        if (!t) return;

        if (!user) {
            const payload = parseJwt(t);
            const rawId = payload?.userId ?? payload?.usuarioId ?? payload?.id;
            const id =
                typeof rawId === "number"
                    ? rawId
                    : typeof rawId === "string" && /^\d+$/.test(rawId)
                    ? Number(rawId)
                    : null;

            if (id) fetchUser(id, t);
        }
    }, [token, user]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.replace("/");
    };

    if (authLoading) return <div className="text-center text-gray-300 mt-10">Cargando...</div>;
    if (!token) return <div className="text-center text-gray-300 mt-10">Redirigiendo...</div>;
    if (!user) return <div className="text-center text-gray-300 mt-10">Verificando...</div>;

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
