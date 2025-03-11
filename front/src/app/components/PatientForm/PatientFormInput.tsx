import React from "react";

interface PatientFormInputProps {
  label: string;
  type: "date" | "select";
  value: string;
  onChange: (value: string) => void;
  options?: string[];
}

const PatientFormInput: React.FC<PatientFormInputProps> = ({
  label,
  type,
  value,
  onChange,
  options = [],
}) => {
  return (
    <div className="w-1/4">
      <label htmlFor={label} className="text-black font-bold">{label}</label>
      {type === "date" ? (
        <input
          id={label}
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 p-2 border rounded text-black w-full"
        />
      ) : (
        <select
          id={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="mt-2 p-2 border rounded text-black w-full"
        >
          <option value="">Selecciona una opción</option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default PatientFormInput;
