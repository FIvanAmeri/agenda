"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
    FaCalendarAlt,
    FaPlusSquare,
    FaSignOutAlt,
    FaHospitalAlt,
    FaChartBar,
    FaUsers,
    FaBars,
    FaTimes
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
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const handleNavigation = (path: string) => {
        router.push(path);
        setIsOpen(false);
    };

    const handleAction = (action: () => void) => {
        action();
        setIsOpen(false);
    };

    return (
        <>
            <div className="md:hidden bg-cyan-950 text-white p-4 flex justify-between items-center sticky top-0 z-[50] border-b border-gray-700 w-full">
                <div className="flex items-center">
                    <FaHospitalAlt className="text-2xl text-green-400 mr-2" />
                    <span className="font-bold">Control Honorarios</span>
                </div>
                <button onClick={toggleMenu} className="text-2xl text-green-400">
                    {isOpen ? <FaTimes /> : <FaBars />}
                </button>
            </div>

            {isOpen && (
                <div 
                    className="fixed inset-0 bg-black/60 z-[55] md:hidden" 
                    onClick={toggleMenu}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-[40] w-64 bg-cyan-950 text-gray-100 flex flex-col transition-transform duration-300 ease-in-out transform
                ${isOpen ? "translate-x-0" : "-translate-x-full"}
                md:translate-x-0 md:fixed md:h-screen md:flex-shrink-0
            `}>
                <div className="flex-grow overflow-y-auto custom-scrollbar-subtle p-6">
                    <div className="hidden md:flex items-center mb-10">
                        <FaHospitalAlt className="text-3xl text-green-400 mr-3" />
                        <h1 className="text-xl font-bold">Control de honorarios</h1>
                    </div>

                    <div className="mb-8 border-b border-gray-700 pb-4">
                        <p className="text-sm">Bienvenido/a,</p>
                        <p className="font-semibold text-green-400">{userName}</p>
                    </div>

                    <nav className="space-y-3">
                        <button 
                            onClick={() => handleNavigation("/Principal")} 
                            className="w-full flex items-center p-3 hover:bg-cyan-800 rounded-lg text-left"
                        >
                            <FaUsers className="mr-4 text-green-400" /> Ver Pacientes
                        </button>

                        <button 
                            onClick={() => handleAction(() => setShowAddModal(true))} 
                            className="w-full flex items-center p-3 hover:bg-cyan-800 rounded-lg text-left"
                        >
                            <FaPlusSquare className="mr-4 text-green-400" /> Nuevo Paciente
                        </button>

                        <button 
                            onClick={() => handleNavigation("/Principal?view=cirugias")} 
                            className="w-full flex items-center p-3 hover:bg-cyan-800 rounded-lg text-left"
                        >
                            <FaCalendarAlt className="mr-4 text-green-400" /> Ver cirugías
                        </button>

                        <button 
                            onClick={() => handleAction(() => setShowCirugiaModal(true))} 
                            className="w-full flex items-center p-3 hover:bg-cyan-800 rounded-lg text-left"
                        >
                            <FaPlusSquare className="mr-4 text-green-400" /> Agregar cirugía
                        </button>

                        <button 
                            onClick={() => handleNavigation("/Principal?view=estadisticas")}
                            className="w-full flex items-center p-3 hover:bg-cyan-800 rounded-lg text-left"
                        >
                            <FaChartBar className="mr-4 text-green-400" /> Estadísticas estudios
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
            <div className="hidden md:block md:w-64 md:flex-shrink-0"></div>
        </>
    );
};

export default Sidebar;