"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
    FaCalendarAlt,
    FaPlusSquare,
    FaSignOutAlt,
    FaHospitalAlt,
    FaChartBar,
    FaMoneyBillAlt,
    FaUsers
} from "react-icons/fa";

interface SidebarProps {
    handleLogout: () => void;
    setShowAddModal: (show: boolean) => void;
    setShowCirugiaModal: (show: boolean) => void;
    userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({
    handleLogout,
    setShowAddModal,
    setShowCirugiaModal,
    userName
}) => {
    const router = useRouter();

    return (
        /* CAMBIO AQUÍ: Agregado sticky, top-0 y h-screen */
        <aside className="w-64 flex-shrink-0 bg-cyan-950 text-gray-100 flex flex-col sticky top-0 h-screen">
            <div className="flex-grow overflow-y-auto custom-scrollbar-subtle p-6">
                <div className="flex items-center mb-10">
                    <FaHospitalAlt className="text-3xl text-green-400 mr-3" />
                    <h1 className="text-xl font-bold">Control de honorarios</h1>
                </div>

                <div className="mb-8 border-b border-gray-700 pb-4">
                    <p className="text-sm">Bienvenido/a,</p>
                    <p className="font-semibold text-green-400">{userName}</p>
                </div>

                <nav className="space-y-3">
                    <button 
                        onClick={() => router.push("/Principal")} 
                        className="w-full flex items-center p-3 hover:bg-cyan-800 rounded-lg"
                    >
                        <FaUsers className="mr-4 text-green-400" /> Ver Pacientes
                    </button>

                    <button 
                        onClick={() => setShowAddModal(true)} 
                        className="w-full flex items-center p-3 hover:bg-cyan-800 rounded-lg"
                    >
                        <FaPlusSquare className="mr-4 text-green-400" /> Nuevo Paciente
                    </button>

                    <button 
                        onClick={() => router.push("/Principal?view=cirugias")} 
                        className="w-full flex items-center p-3 hover:bg-cyan-800 rounded-lg"
                    >
                        <FaCalendarAlt className="mr-4 text-green-400" /> Ver cirugías
                    </button>

                    <button 
                        onClick={() => setShowCirugiaModal(true)} 
                        className="w-full flex items-center p-3 hover:bg-cyan-800 rounded-lg"
                    >
                        <FaPlusSquare className="mr-4 text-green-400" /> Agregar cirugía
                    </button>

                    <button 
                        className="w-full flex items-center p-3 hover:bg-cyan-800 rounded-lg"
                    >
                        <FaMoneyBillAlt className="mr-4 text-green-400" /> Informes de cobros
                    </button>

                    <button 
                        onClick={() => router.push("/Principal?view=estadisticas")}
                        className="w-full flex items-center p-3 hover:bg-cyan-800 rounded-lg"
                    >
                        <FaChartBar className="mr-4 text-green-400" /> Estadísticas
                    </button>
                </nav>
            </div>

            <div className="p-6 border-t border-gray-700">
                <button 
                    onClick={handleLogout} 
                    className="w-full flex items-center p-3 bg-red-700 hover:bg-red-800 rounded-lg"
                >
                    <FaSignOutAlt className="mr-4" /> Salir
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;