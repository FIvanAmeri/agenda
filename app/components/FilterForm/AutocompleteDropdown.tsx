"use client";

import React, { memo } from "react";

interface Props {
    filteredNames: string[];
    onSelect: (name: string) => void;
}

const AutocompleteDropdown: React.FC<Props> = memo(({ filteredNames, onSelect }) => {
    return (
        <div
            className="absolute z-[100] w-full bg-white border border-gray-600 rounded-lg mt-1 shadow-2xl max-h-60 overflow-y-auto"
            style={{ top: "100%", left: 0 }}
        >
            {filteredNames.length > 0 ? (
                filteredNames.map((name: string) => (
                    <div
                        key={name}
                        onMouseDown={(e: React.MouseEvent<HTMLDivElement>) => {
                            e.preventDefault();
                            onSelect(name);
                        }}
                        className="p-3 text-sm text-gray-900 cursor-pointer hover:bg-cyan-100 hover:text-cyan-900 border-b border-gray-100 last:border-none transition-colors duration-150"
                    >
                        {name}
                    </div>
                ))
            ) : (
                <div className="p-3 text-sm text-gray-500 italic bg-gray-50">
                    No hay coincidencias.
                </div>
            )}
        </div>
    );
});

AutocompleteDropdown.displayName = "AutocompleteDropdown";

export default AutocompleteDropdown;