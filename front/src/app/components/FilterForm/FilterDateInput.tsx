import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { parseISO } from "../../utils/dateUtils";

interface FilterDateInputProps {
    label: string;
    value: string;
    onChange: (date: Date | null) => void;
}

export const FilterDateInput: React.FC<FilterDateInputProps> = ({ label, value, onChange }) => (
    <div className="flex flex-col w-full">
        <label className="text-xs font-medium text-gray-400 mb-1">{label}</label>
        <DatePicker
            selected={parseISO(value)}
            onChange={onChange}
            dateFormat="dd/MM/yyyy"
            placeholderText="DD/MM/AAAA"
            className="p-2 border border-gray-600 rounded-lg text-sm text-black focus:outline-none focus:ring-2 focus:ring-cyan-400 shadow-inner w-full h-10"
            wrapperClassName="w-full"
        />
    </div>
);