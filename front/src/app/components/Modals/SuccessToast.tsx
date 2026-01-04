"use client";

import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

export const SuccessToast: React.FC<{ message: string; description: string }> = ({ message, description }) => {
    return (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[10000] animate-in fade-in zoom-in duration-300">
            <div className="bg-[#0f172a] border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.5)] px-8 py-5 rounded-2xl flex items-center gap-5 backdrop-blur-md">
                <FaCheckCircle className="text-emerald-500 text-3xl" />
                <div className="flex flex-col">
                    <span className="text-white font-extrabold text-lg tracking-tight">{message}</span>
                    <span className="text-emerald-400 text-sm font-medium">{description}</span>
                </div>
            </div>
        </div>
    );
};