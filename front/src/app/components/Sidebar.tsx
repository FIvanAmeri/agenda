
import React from 'react';
import { useRouter } from 'next/navigation';
import { FaCalendarAlt, FaPlusSquare, FaUserMd, FaUsers, FaSignOutAlt, FaHospitalAlt } from 'react-icons/fa';


interface SidebarProps {
    handleLogout: () => void;
    setShowAddModal: (show: boolean) => void;
    userName: string;
}


const navItems = [
    {
        name: 'Nuevo Paciente',
        icon: FaPlusSquare,
        path: '',
        action: 'modal' as const
    },
    {
        name: 'Agregar Cirugía',
        icon: FaCalendarAlt,
        path: '/principal',
        action: 'navigate' as const
    },

    {
        name: 'Pacientes',
        icon: FaUsers,
        path: '/pacientes',
        action: 'navigate' as const
    },
];

const Sidebar: React.FC<SidebarProps> = ({ handleLogout, setShowAddModal, userName }) => {
    const router = useRouter();

    const handleItemClick = (item: typeof navItems[0]) => {
        if (item.action === 'navigate') {
            router.push(item.path);
        } else if (item.action === 'modal') {
            setShowAddModal(true);
        }
    };

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
                    {navItems.map((item) => (
                        <button
                            key={item.name}
                            className="w-full flex items-center p-3 rounded-lg hover:bg-cyan-800 transition-colors duration-200 focus:outline-none text-left"
                            onClick={() => handleItemClick(item)}
                        >
                            <item.icon className="text-lg mr-4 text-green-400" />
                            <span className="font-medium">{item.name}</span>
                        </button>
                    ))}
                </nav>
            </div>

            <div className="p-6 border-t border-gray-700">
                <button
                    className="w-full flex items-center p-3 rounded-lg bg-red-700 hover:bg-red-800 transition-colors duration-200 focus:outline-none"
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