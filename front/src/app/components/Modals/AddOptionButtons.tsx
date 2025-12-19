"use client";

import React from 'react';

interface AddOptionButtonsProps {
    onOpenAddModal: (target: 'obraSocial' | 'institucion' | 'practicas', label: string) => void;
}

export const AddOptionButtons: React.FC<AddOptionButtonsProps> = ({ onOpenAddModal }) => {
    return (
        <div className="flex flex-wrap gap-4 pt-4 border-t border-cyan-800/30">
            <button 
                type="button" 
                onClick={(): void => onOpenAddModal('obraSocial', 'Nueva Obra Social')} 
                className="text-[10px] flex items-center gap-2 text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-md border border-cyan-800"
            >
                <span>+</span> Obra Social
            </button>
            <button 
                type="button" 
                onClick={(): void => onOpenAddModal('institucion', 'Nueva Institución')} 
                className="text-[10px] flex items-center gap-2 text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-md border border-cyan-800"
            >
                <span>+</span> Institución
            </button>
            <button 
                type="button" 
                onClick={(): void => onOpenAddModal('practicas', 'Nueva Práctica')} 
                className="text-[10px] flex items-center gap-2 text-cyan-400 bg-cyan-950/40 px-3 py-1.5 rounded-md border border-cyan-800"
            >
                <span>+</span> Práctica
            </button>
        </div>
    );
};