import React from "react";

interface HeaderProps {
  user: string;
  handleLogout: () => void;
  setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const Header: React.FC<HeaderProps> = ({ user, handleLogout, setShowAddModal }) => {
  return (
    <div>
      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mt-10 mb-6 text-center">
        Espero que estés teniendo un lindo día, {user}
      </h1>

      <div className="flex justify-between items-center mt-4 ml-[10px]">
        <button
          onClick={() => setShowAddModal(true)}
          className="py-2 px-6 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
        >
          Agregar Paciente
        </button>

        <button
          onClick={handleLogout}
          className="py-2 px-6 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 mr-2 mb-2"
        >
          Salir
        </button>
      </div>
    </div>
  );
};

export default Header;
