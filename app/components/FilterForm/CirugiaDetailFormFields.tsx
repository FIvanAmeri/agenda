"use client";

import React from "react";
import { Cirugia } from "../../components/interfaz/interfaz";
import { GeneralSection } from "../Cirugia/GeneralSection";
import { DoctorsSection } from "../Cirugia/DoctorsSection";
import { PaymentSectionsGroup } from "../DetailsForm/PaymentSectionsGroup";

interface CirugiaDetailFormFieldsProps {
    formData: Partial<Cirugia>;
    medicosOpciones: string[];
    tiposCirugiaOpciones: string[];
    obrasSocialesOpciones: string[];
    handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
    handleNumericChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CirugiaDetailFormFields: React.FC<CirugiaDetailFormFieldsProps> = ({
    formData,
    medicosOpciones,
    tiposCirugiaOpciones,
    obrasSocialesOpciones,
    handleInputChange,
    handleNumericChange
}) => {
    return (
        <div className="space-y-6">
            <GeneralSection 
                formData={formData} 
                tiposCirugiaOpciones={tiposCirugiaOpciones} 
                obrasSocialesOpciones={obrasSocialesOpciones} 
                handleInputChange={handleInputChange} 
            />

            <DoctorsSection 
                formData={formData} 
                medicosOpciones={medicosOpciones} 
                handleInputChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void} 
            />

            <PaymentSectionsGroup
                formData={formData}
                onInputChange={handleInputChange as (e: React.ChangeEvent<HTMLSelectElement>) => void}
                onNumericChange={handleNumericChange}
            />
        </div>
    );
};