import React from "react";
import { Cirugia } from "../../components/interfaz/interfaz";
import { PaymentSection } from "../Cirugia/PaymentSection";
import { PAYMENT_SECTIONS_CONFIG } from "./PaymentFieldsConfig";

interface PaymentSectionsGroupProps {
    formData: Partial<Cirugia>;
    onInputChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onNumericChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const PaymentSectionsGroup: React.FC<PaymentSectionsGroupProps> = ({
    formData,
    onInputChange,
    onNumericChange
}) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {PAYMENT_SECTIONS_CONFIG.map((section) => (
                <PaymentSection
                    key={section.totalName}
                    title={section.title}
                    totalName={section.totalName}
                    paidName={section.paidName}
                    statusName={section.statusName}
                    totalValue={formData[section.totalName] as number}
                    paidValue={formData[section.paidName] as number}
                    statusValue={(formData[section.statusName] as string) || "no pagado"}
                    onInputChange={onInputChange}
                    onNumericChange={onNumericChange}
                />
            ))}
        </div>
    );
};