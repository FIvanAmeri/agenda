import React from "react";
import { Cirugia } from "../../components/interfaz/interfaz";
import { FormInput } from "./FormInput";

interface PaymentSectionProps {
    title: string;
    totalName: string;
    paidName: string;
    statusName: string;
    totalValue: number | null | undefined;
    paidValue: number | null | undefined;
    statusValue: string;
    onInputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onNumericChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const getStatusClass = (status: string): string => {
    switch (status) {
        case "pagado": return "bg-green-600/50";
        case "parcialmente pagado": return "bg-yellow-600/50";
        case "no pagado": return "bg-red-600/50";
        default: return "bg-gray-600/50";
    }
};

export const PaymentSection: React.FC<PaymentSectionProps> = ({
    title,
    totalName,
    paidName,
    statusName,
    totalValue,
    paidValue,
    statusValue,
    onInputChange,
    onNumericChange
}) => {
    const statusOptions = ["no pagado", "parcialmente pagado", "pagado"];
    
    return (
        <fieldset className="p-4 border border-[#1f3b47] rounded-lg space-y-4">
            <legend className="text-lg font-semibold text-cyan-400 px-2">{title}</legend>
            <FormInput
                label="Monto Total"
                name={totalName}
                type="number"
                value={totalValue ?? ""}
                onChange={onNumericChange}
                step="0.01"
                min="0"
            />
            <FormInput
                label="Monto Pagado"
                name={paidName}
                type="number"
                value={paidValue ?? ""}
                onChange={onNumericChange}
                required
                step="0.01"
                min="0"
            />
            <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Estado de Pago</label>
                <select
                    name={statusName}
                    value={statusValue}
                    onChange={onInputChange}
                    className={`w-full p-2 border border-gray-600 rounded-md text-white focus:ring-cyan-500 focus:border-cyan-500 ${getStatusClass(statusValue)}`}
                >
                    {statusOptions.map((opt) => (
                        <option key={opt} value={opt}>{opt.toUpperCase()}</option>
                    ))}
                </select>
            </div>
        </fieldset>
    );
};