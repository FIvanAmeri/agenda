import React from "react";
import { useAutocomplete } from "../../hooks/Filtro/useAutocomplete";
import AutocompleteDropdown from "./AutocompleteDropdown";
import { FilterFieldKey } from "./types";

interface Props {
    label: string;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
    fieldKey: FilterFieldKey;
    filteredNames: string[];
    placeholder: string;
    dataTestId: string;
    isShowing: boolean;
    setter: React.Dispatch<React.SetStateAction<boolean>>;
    handleOpen: (field: FilterFieldKey) => void;
    handleSuggestionClick: (
        name: string,
        setValue: React.Dispatch<React.SetStateAction<string>>
    ) => void;
}

const AutocompleteInput: React.FC<Props> = ({
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
    const { wrapperRef, inputRef } = useAutocomplete({
        isShowing: isShowing,
        value: value,
        setter: setter,
    });

    return (
        <div ref={wrapperRef} className="flex flex-col relative" data-testid={dataTestId}>
            <label className="text-xs font-medium text-gray-300 mb-1">{label}</label>

            <input
                ref={inputRef}
                type="text"
                value={value}
                onFocus={() => handleOpen(fieldKey)}
                onChange={(e) => setValue(e.target.value)}
                className="w-full p-2 border border-gray-500 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={placeholder}
            />

            {isShowing && (
                <AutocompleteDropdown
                    filteredNames={filteredNames}
                    onSelect={(name) => handleSuggestionClick(name, setValue)}
                />
            )}
        </div>
    );
};

export default AutocompleteInput;