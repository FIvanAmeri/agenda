import React from "react";

interface HeaderButtonsProps {
  onAdd: () => void;
  onLogout: () => void;
}

export const HeaderButtons: React.FC<HeaderButtonsProps> = ({ onAdd, onLogout }) => (
  <div className="flex justify-between items-center mt-4 ml-[10px]">
    <button
      onClick={onAdd}
      className="py-2 px-6 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[200px]"
    >
      Agregar Turno
    </button>

    <button
      onClick={onLogout}
      className="py-2 px-6 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 mr-2 mb-2"
    >
      Salir
    </button>
  </div>
);