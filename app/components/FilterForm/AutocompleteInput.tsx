"use client";

import React, { memo, useState, useEffect } from "react";
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
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  useEffect(() => {
    setActiveIndex(-1);
  }, [value, isShowing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (!isShowing) {
      if (e.key === "ArrowDown") handleOpen(fieldKey);
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setActiveIndex(prev => (prev < filteredNames.length - 1 ? prev + 1 : prev));
        break;
      case "ArrowUp":
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : 0));
        break;
      case "Enter":
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < filteredNames.length) {
          handleSuggestionClick(filteredNames[activeIndex]);
          setter(false);
        }
        break;
      case "Escape":
        setter(false);
        break;
      case "Tab":
        setter(false);
        break;
    }
  };

  return (
    <div className="flex flex-col w-full relative">
      <label className="text-[11px] uppercase font-black text-cyan-500/70 mb-1.5 ml-1 tracking-widest">{label}</label>
      <div className="relative w-full">
        <input
          key={`stable-input-${fieldKey}`}
          type="text"
          autoComplete="off"
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
          onFocus={() => handleOpen(fieldKey)}
          onClick={() => handleOpen(fieldKey)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          data-testid={dataTestId}
          className="p-2.5 bg-[#1a3a4a]/50 border border-[#2d4a57] rounded-xl text-sm text-white w-full h-11 focus:border-cyan-500 focus:bg-[#1a3a4a] transition-all duration-300 outline-none pr-16 shadow-inner"
        />
        
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-2">
          {value && (
            <button
              type="button"
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                e.preventDefault();
                e.stopPropagation();
                setValue("");
                handleOpen(fieldKey);
              }}
              className="text-gray-400 hover:text-red-400 transition-colors"
            >
              <FaTimesCircle size={14} />
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
            className="text-gray-500 hover:text-cyan-400 transition-colors border-l border-[#2d4a57] pl-2"
          >
            <FaChevronDown size={12} className={`transform transition-transform duration-300 ${isShowing ? "rotate-180" : "rotate-0"}`} />
          </button>
        </div>

        {isShowing && (
          <AutocompleteDropdown
            filteredNames={filteredNames}
            activeIndex={activeIndex}
            onSelect={(name: string) => {
              handleSuggestionClick(name);
              setter(false);
            }}
          />
        )}
      </div>
    </div>
  );
});

AutocompleteInput.displayName = "AutocompleteInput";

export default AutocompleteInput;