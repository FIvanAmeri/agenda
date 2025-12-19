import React from "react";
import { GeneralSection } from "../Cirugia/GeneralSection";
import { DoctorsSection } from "../Cirugia/DoctorsSection";
import { PaymentSectionsGroup } from "./PaymentSectionsGroup";
import { CirugiaDetailFormFieldsProps } from "./FormFieldsTypes";
import { SelectInputChangeEvent } from "./FormEventTypes";

export const FormSectionsList: React.FC<CirugiaDetailFormFieldsProps> = ({
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
                handleInputChange={handleInputChange as (e: SelectInputChangeEvent) => void} 
            />

            <PaymentSectionsGroup
                formData={formData}
                onInputChange={handleInputChange as (e: SelectInputChangeEvent) => void}
                onNumericChange={handleNumericChange}
            />
        </>
    );
};