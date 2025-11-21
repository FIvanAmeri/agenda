import React from "react";

interface Props {
  filteredNames: string[];
  onSelect: (name: string) => void;
}

const AutocompleteDropdown: React.FC<Props> = ({ filteredNames, onSelect }) => {
  return (
    <div
      className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg max-h-60 overflow-y-auto"
      style={{ top: "100%", left: 0 }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {filteredNames.length > 0 ? (
        filteredNames.map((name) => (
          <div
            key={name}
            onMouseDown={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onSelect(name);
            }}
            className="p-2 text-sm text-gray-800 cursor-pointer hover:bg-green-100 transition-colors"
          >
            {name}
          </div>
        ))
      ) : (
        <div className="p-2 text-sm text-gray-500">
          No hay coincidencias. Puede ingresar el valor.
        </div>
      )}
    </div>
  );
};

export default AutocompleteDropdown;
