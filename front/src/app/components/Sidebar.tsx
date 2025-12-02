"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { FaCalendarAlt, FaPlusSquare, FaSignOutAlt, FaHospitalAlt, FaChartBar, FaMoneyBillAlt, FaUsers } from 'react-icons/fa';

interface SidebarProps {
    handleLogout: () => void;
    setShowAddModal: (show: boolean) => void;
    setShowCirugiaModal: (show: boolean) => void;
    userName: string;
}

const Sidebar: React.FC<SidebarProps> = ({ handleLogout, setShowAddModal, setShowCirugiaModal, userName }) => {
    const [cirugiasOpen, setCirugiasOpen] = useState(false);

    return (
        <div className="w-64 min-h-screen bg-cyan-950 text-gray-100 flex flex-col justify-between shadow-lg fixed">
            <div className="p-6">
                <div className="flex items-center mb-10">
                    <FaHospitalAlt className="text-3xl text-green-400 mr-3" />
                    <h1 className="text-xl font-bold tracking-wider">Agenda Médica</h1>
                </div>

                <div className="mb-8 text-sm border-b border-gray-700 pb-4">
                    <p className="font-light">Bienvenido/a,</p>
                    <p className="font-semibold text-green-400">{userName}</p>
                </div>

                <nav className="space-y-3">

                    <Link
                        href="/"
                        className="w-full flex items-center p-3 rounded-lg hover:bg-cyan-800 transition-colors duration-200"
                    >
                        <FaUsers className="text-lg mr-4 text-green-400" />
                        <span className="font-medium">Ver Pacientes</span>
                    </Link>

                    <button
                        className="w-full flex items-center p-3 rounded-lg hover:bg-cyan-800 transition-colors duration-200 text-left"
                        onClick={() => setShowAddModal(true)}
                    >
                        <FaPlusSquare className="text-lg mr-4 text-green-400" />
                        <span className="font-medium">Nuevo Paciente</span>
                    </button>

                    <div>
                        <button
                            className="w-full flex items-center p-3 rounded-lg hover:bg-cyan-800 transition-colors duration-200 text-left"
                            onClick={() => setCirugiasOpen((s) => !s)}
                        >
                            <FaCalendarAlt className="text-lg mr-4 text-green-400" />
                            <span className="font-medium">Cirugías</span>
                        </button>

                        {cirugiasOpen && (
                            <div className="mt-2 ml-6 flex flex-col space-y-1">
                                <button
                                    className="w-full text-left p-2 rounded-lg hover:bg-cyan-800 transition-colors duration-200"
                                    onClick={() => setShowCirugiaModal(true)}
                                >
                                    Agregar cirugía
                                </button>

                                <Link
                                    href="/Cirugia"
                                    className="w-full text-left p-2 rounded-lg hover:bg-cyan-800 transition-colors duration-200"
                                >
                                    Ver cirugías
                                </Link>
                            </div>
                        )}
                    </div>

                    <Link
                        href="/cobros"
                        className="w-full flex items-center p-3 rounded-lg hover:bg-cyan-800 transition-colors duration-200"
                    >
                        <FaMoneyBillAlt className="text-lg mr-4 text-green-400" />
                        <span className="font-medium">Informes de cobros</span>
                    </Link>

                    <Link
                        href="/informes"
                        className="w-full flex items-center p-3 rounded-lg hover:bg-cyan-800 transition-colors duration-200"
                    >
                        <FaChartBar className="text-lg mr-4 text-green-400" />
                        <span className="font-medium">Información de Cirugías</span>
                    </Link>
                </nav>
            </div>

            <div className="p-6 border-t border-gray-700">
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
