"use client";

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaPlusSquare, FaSignOutAlt, FaHospitalAlt, FaChartBar, FaMoneyBillAlt, FaUsers } from 'react-icons/fa';

interface SidebarProps {
    handleLogout: () => void;
    setShowAddModal: (show: boolean) => void;
    setShowCirugiaModal: (show: boolean) => void;
    userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ handleLogout, setShowAddModal, setShowCirugiaModal, userName }) => {
    const router = useRouter();

    const handleMenuClick = () => {
    };

    const handleNewPatientClick = () => {
        setShowAddModal(true);
    };

    const handleAddCirugiaClick = () => {
        setShowCirugiaModal(true);
    };

    const handleViewCirugiasClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        router.push('/Principal?view=cirugias');
    };

    const handleViewPacientesClick = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
        e.preventDefault();
        router.push('/Principal');
    };

    return (
        <div className="w-64 h-screen bg-cyan-950 text-gray-100 flex flex-col shadow-lg fixed top-0 left-0">
            <div className="flex-grow overflow-y-auto custom-scrollbar-subtle">
                <div className="p-6">
                    <div className="flex items-center mb-10">
                        <FaHospitalAlt className="text-3xl text-green-400 mr-3" />
                        <h1 className="text-xl font-bold tracking-wider">Control de honorarios</h1>
                    </div>

                    <div className="mb-8 text-sm border-b border-gray-700 pb-4">
                        <p className="font-light">Bienvenido/a,</p>
                        <p className="font-semibold text-green-400">{userName}</p>
                    </div>

                    <nav className="space-y-3">

                        <button
                            onClick={handleViewPacientesClick}
                            className="w-full flex items-center p-3 rounded-lg hover:bg-cyan-800 transition-colors duration-200 text-left"
                        >
                            <FaUsers className="text-lg mr-4 text-green-400" />
                            <span className="font-medium">Ver Pacientes</span>
                        </button>

                        <button
                            className="w-full flex items-center p-3 rounded-lg hover:bg-cyan-800 transition-colors duration-200 text-left"
                            onClick={handleNewPatientClick}
                        >
                            <FaPlusSquare className="text-lg mr-4 text-green-400" />
                            <span className="font-medium">Nuevo Paciente</span>
                        </button>

                        <div className="space-y-1">
                            <button
                                onClick={handleViewCirugiasClick}
                                className="w-full flex items-center p-3 rounded-lg hover:bg-cyan-800 transition-colors duration-200 text-left"
                            >
                                <FaCalendarAlt className="text-lg mr-4 text-green-400" />
                                <span className="font-medium">Ver cirugías</span>
                            </button>

                            <button
                                className="w-full flex items-center p-3 rounded-lg hover:bg-cyan-800 transition-colors duration-200 text-left"
                                onClick={handleAddCirugiaClick}
                            >
                                <FaPlusSquare className="text-lg mr-4 text-green-400" />
                                <span className="font-medium">Agregar cirugía</span>
                            </button>
                        </div>
                        
                        <Link
                            href="/cobros"
                            onClick={handleMenuClick}
                            className="w-full flex items-center p-3 rounded-lg hover:bg-cyan-800 transition-colors duration-200"
                        >
                            <FaMoneyBillAlt className="text-lg mr-4 text-green-400" />
                            <span className="font-medium">Informes de cobros</span>
                        </Link>

                        <Link
                            href="/informes"
                            onClick={handleMenuClick}
                            className="w-full flex items-center p-3 rounded-lg hover:bg-cyan-800 transition-colors duration-200"
                        >
                            <FaChartBar className="text-lg mr-4 text-green-400" />
                            <span className="font-medium">Información de Cirugías</span>
                        </Link>
                    </nav>
                </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex-shrink-0">
                <button
                    className="w-full flex items-center p-3 rounded-lg bg-red-700 hover:bg-red-800 transition-colors duration-200"
                    onClick={handleLogout}
                >
                    <FaSignOutAlt className="text-lg mr-4 text-white" />
                    <span className="font-medium">Salir</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;