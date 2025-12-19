import React from "react";
import { FaRedo } from "react-icons/fa";

interface FilterResetButtonProps {
    onClick: () => void;
}

export const FilterResetButton: React.FC<FilterResetButtonProps> = ({ onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className="flex items-center justify-center p-2 h-10 w-full bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition duration-200 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-red-500 transform hover:scale-[1.02] sm:col-span-2 md:col-span-1 lg:col-span-1 xl:col-span-1"
    >
        <FaRedo className="mr-1" />
        Limpiar
    </button>
);