import React from "react";
import { FaChevronDown } from "react-icons/fa";
import { FilterFieldKey } from "../../hooks/Filtro/useFilterDropdowns";

interface AutocompleteInputProps {
    label: string
    value: string
    setValue: (value: string) => void
    fieldKey: FilterFieldKey
    filteredNames: string[]
    placeholder: string
    dataTestId: string
    isShowing: boolean
    handleOpen: (field: FilterFieldKey) => void
    handleSuggestionClick: (name: string) => void
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
    label,
    value,
    setValue,
    fieldKey,
    filteredNames,
    placeholder,
    dataTestId,
    isShowing,
    handleOpen,
    handleSuggestionClick,
}) => {
    return (
        <div className="flex flex-col relative">
            <label className="text-xs font-medium text-gray-400 mb-1">{label}</label>
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                    onFocus={() => handleOpen(fieldKey)}
                    placeholder={placeholder}
                    data-testid={dataTestId}
                    className="w-full p-2 border border-gray-600 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner h-10 pr-8"
                />
                <button
                    type="button"
                    onClick={() => handleOpen(fieldKey)}
                    className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-400 hover:text-cyan-400"
                >
                    <FaChevronDown className={`transform transition-transform duration-200 ${isShowing ? "rotate-180" : "rotate-0"}`} />
                </button>
            </div>

            {isShowing && (
                <div className="absolute top-full z-10 w-full bg-gray-700 border border-gray-600 rounded-lg mt-1 max-h-48 overflow-y-auto shadow-xl">
                    {filteredNames.length > 0 ? (
                        filteredNames.map((name: string) => (
                            <div
                                key={name}
                                className="p-2 text-sm text-white hover:bg-cyan-600 cursor-pointer transition-colors duration-100"
                                onClick={() => handleSuggestionClick(name)}
                            >
                                {name}
                            </div>
                        ))
                    ) : (
                        <div className="p-2 text-sm text-gray-400">
                            No se encontraron resultados
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

export default AutocompleteInput