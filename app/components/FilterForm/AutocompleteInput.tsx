"use client";

import React, { memo } from "react";
import AutocompleteDropdown from "./AutocompleteDropdown";
import { FilterFieldKey } from "../../hooks/Filtro/useFilterDropdowns";
import { FaChevronDown, FaTimesCircle } from "react-icons/fa";

interface AutocompleteInputProps {
  label: string;
  value: string;
  setValue: (val: string) => void;
  fieldKey: FilterFieldKey;
  filteredNames: string[];
  placeholder: string;
  dataTestId: string;
  isShowing: boolean;
  setter: React.Dispatch<React.SetStateAction<boolean>>;
  handleOpen: (field: FilterFieldKey) => void;
  handleSuggestionClick: (name: string) => void;
}

const AutocompleteInput: React.FC<AutocompleteInputProps> = memo(({
  label,
  value,
  setValue,
  fieldKey,
  filteredNames,
  placeholder,
  dataTestId,
  isShowing,
  setter,
  handleOpen,
  handleSuggestionClick,
}) => {
  return (
    <div className="flex flex-col w-full relative">
      <label className="text-xs font-medium text-gray-400 mb-1">{label}</label>
      <div className="relative w-full">
        <input
          key={`stable-input-${fieldKey}`}
          type="text"
          autoComplete="off"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          onFocus={() => handleOpen(fieldKey)}
          onClick={() => handleOpen(fieldKey)}
          placeholder={placeholder}
          data-testid={dataTestId}
          className="p-2 border border-gray-600 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner w-full h-10 pr-16"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-2 gap-1">
          {value && (
            <button
              type="button"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                e.stopPropagation();
                setValue("");
                handleOpen(fieldKey);
              }}
              className="text-red-500 hover:text-red-700 transition-colors p-1"
            >
              <FaTimesCircle />
            </button>
          )}
          
          <button
            type="button"
            tabIndex={-1}
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              e.preventDefault();
              e.stopPropagation();
              if (isShowing) {
                setter(false);
              } else {
                handleOpen(fieldKey);
              }
            }}
            className="text-gray-400 hover:text-cyan-400 p-1"
          >
            <FaChevronDown className={`transform transition-transform duration-200 ${isShowing ? "rotate-180" : "rotate-0"}`} />
          </button>
        </div>

        {isShowing && (
          <div className="absolute z-50 w-full">
            <AutocompleteDropdown
              filteredNames={filteredNames}
              onSelect={(name: string) => {
                handleSuggestionClick(name);
                setter(false);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
});

AutocompleteInput.displayName = "AutocompleteInput";

export default AutocompleteInput;