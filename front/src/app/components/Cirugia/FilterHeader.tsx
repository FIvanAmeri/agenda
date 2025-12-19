import React from "react";
import { FaFilter } from "react-icons/fa";

export const FilterHeader: React.FC = () => (
    <div className="flex items-center mb-4 text-white border-b border-gray-600 pb-3">
        <FaFilter className="mr-3 text-cyan-400 text-lg md:text-xl" />
        <h3 className="font-extrabold text-lg md:text-xl tracking-wide">Filtros de Cirugías</h3>
    </div>
);