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
            className="fixed inset-0 flex items-center justify-center bg-black/70 z-9999 backdrop-blur-sm p-0 md:p-4"
            onClick={onClose}
        >
            <div 
                className="bg-[#0F2A35] w-full h-full md:h-auto md:max-h-[90vh] md:max-w-5xl md:rounded-xl shadow-2xl flex flex-col overflow-hidden border-0 md:border-2 md:border-[#004d40]"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="bg-linear-to-r from-[#004d40] to-[#1a4553] p-4 flex justify-between items-center text-white shrink-0">
                    <h2 className="text-xl font-bold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-white hover:text-red-400 transition p-2 rounded-full hover:bg-black/20"
                        aria-label="Cerrar modal"
                    >
                        <FaTimes className="text-xl" />
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
                    <div className="max-w-4xl mx-auto w-full">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};