"use client";

import React, { memo } from "react";

interface Props {
    filteredNames: string[];
    activeIndex: number;
    onSelect: (name: string) => void;
}

const AutocompleteDropdown: React.FC<Props> = memo(({ filteredNames, activeIndex, onSelect }) => {
    return (
        <div
            className="absolute z-50 w-full bg-[#0F2A35] border border-[#1f3b47] rounded-xl mt-1 shadow-[0_10px_25px_rgba(0,0,0,0.5)] max-h-60 overflow-y-auto custom-scrollbar"
            style={{ top: "100%", left: 0 }}
        >
            <style>
                {`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 6px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: #0F2A35;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: #1f3b47;
                        border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                        background: #0891b2;
                    }
                `}
            </style>
            {filteredNames.length > 0 ? (
                filteredNames.map((name: string, index: number) => (
                    <div
                        key={`${name}-${index}`}
                        onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                            e.preventDefault();
                            onSelect(name);
                        }}
                        className={`p-3 text-sm cursor-pointer transition-all duration-150 border-b border-[#1f3b47]/50 last:border-none
                            ${index === activeIndex 
                                ? "bg-cyan-600 text-white font-bold" 
                                : "text-gray-300 hover:bg-[#1a3a4a] hover:text-cyan-400"
                            }`}
                    >
                        {name}
                    </div>
                ))
            ) : (
                <div className="p-4 text-sm text-gray-500 italic bg-[#0F2A35] text-center">
                    No hay coincidencias.
                </div>
            )}
        </div>
    );
});

AutocompleteDropdown.displayName = "AutocompleteDropdown";

export default AutocompleteDropdown;