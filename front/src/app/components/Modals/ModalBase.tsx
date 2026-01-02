"use client";

import React, { ReactNode } from 'react';
import { FaTimes } from 'react-icons/fa';

interface ModalBaseProps {
    children: ReactNode;
    title: string;
    onClose: () => void;
}

export const ModalBase: React.FC<ModalBaseProps> = ({ children, title, onClose }) => {
    return (
        <div 
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-[9999] transition-opacity duration-300 backdrop-blur-sm"
            onClick={onClose}
        >
            <div 
                className="bg-[#0F2A35] rounded-xl shadow-2xl w-full max-w-5xl mx-4 flex flex-col transform transition-all duration-300 border-2 border-[#004d40] overflow-visible"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-gradient-to-r from-[#004d40] to-[#1a4553] p-4 flex justify-between items-center text-white rounded-t-xl">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-red-400 transition p-1 rounded-full hover:bg-black hover:bg-opacity-20"
                        aria-label="Cerrar modal"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>
                <div className="p-6 overflow-visible">
                    {children}
                </div>
            </div>
        </div>
    );
};