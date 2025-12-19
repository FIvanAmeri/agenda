import React from "react";

interface FormInputProps {
    label: string;
    name: string;
    type: string;
    value: string | number;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    step?: string;
    min?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    name,
    type,
    value,
    onChange,
    required = false,
    step,
    min
}) => (
    <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">
            {label} {required && "*"}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            step={step}
            min={min}
            className="w-full p-2 bg-[#1a4553] border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500"
        />
    </div>
);