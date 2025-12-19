import React from "react";
import { GeneralSection } from "../Cirugia/GeneralSection";
import { DoctorsSection } from "../Cirugia/DoctorsSection";
import { PaymentSectionsGroup } from "./PaymentSectionsGroup";
import { CirugiaDetailFormFieldsProps } from "./FormFieldsTypes";

export const FormSectionsRenderer: React.FC<CirugiaDetailFormFieldsProps> = ({
    formData,
    medicosOpciones,
    tiposCirugiaOpciones,
    obrasSocialesOpciones,
    handleInputChange,
    handleNumericChange
}) => {
    return (
        <>
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
        </>
    );
};