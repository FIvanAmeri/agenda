"use client"

import React, { useEffect } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../app/components/Sidebar"
import { useAuth } from "../app/context/AuthContext"
import { User } from "../app/components/interfaz/interfaz"

interface MainLayoutProps {
    user: User
    children: React.ReactNode
    showAddModal: boolean
    setShowAddModal: (show: boolean) => void
    setShowCirugiaModal: (show: boolean) => void
}

const MainLayout: React.FC<MainLayoutProps> = ({
    user,
    children,
    setShowAddModal,
    setShowCirugiaModal
}) => {
    const router = useRouter()
    const { token, loading, logout } = useAuth()

    useEffect(() => {
        if (!token && !loading) {
            router.replace("/")
        }
    }, [token, loading, router])

    const handleLogoutAction = () => {
        logout()
        router.replace("/")
    }

    if (loading) {
        return <div className="text-center text-gray-300 mt-10">Cargando...</div>
    }

    return (
        <div className="flex flex-col md:flex-row min-h-screen bg-cyan-900 w-full">
            <Sidebar
                handleLogout={handleLogoutAction}
                setShowAddModal={setShowAddModal}
                setShowCirugiaModal={setShowCirugiaModal}
                userName={user.usuario}
            />
            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}

export default MainLayout