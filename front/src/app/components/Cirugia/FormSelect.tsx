import React from "react";

interface FormSelectProps {
    label: string;
    name: string;
    value: string;
    options: string[];
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    required?: boolean;
    className?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
    label,
    name,
    value,
    options,
    onChange,
    required = false,
    className = "w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
            {label} {required && "*"}
        </label>
        <select
            name={name}
            value={value || ""}
            onChange={onChange}
            required={required}
            className={className}
        >
            <option value="">Seleccionar {label.toLowerCase()}</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </select>
    </div>
);