"use client";

import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface SuccessToastProps {
    message: string;
    description: string;
}

export const SuccessToast: React.FC<SuccessToastProps> = ({ message, description }) => {
    return (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[200] animate-in fade-in zoom-in duration-300">
            <div className="bg-[#0f172a] border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)] px-6 py-4 rounded-xl flex items-center gap-4">
                <FaCheckCircle className="text-emerald-500 text-2xl" />
                <div className="flex flex-col">
                    <span className="text-white font-bold tracking-wide">{message}</span>
                    <span className="text-emerald-400/80 text-xs">{description}</span>
                </div>
            </div>
        </div>
    );
};