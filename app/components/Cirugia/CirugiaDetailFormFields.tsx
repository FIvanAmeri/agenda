"use client";

import React from "react";
import { SectionsWrapper } from "../DetailsForm/SectionsWrapper";
import { CirugiaDetailFormFieldsProps } from "../DetailsForm/FormFieldsTypes";
import { FormSectionsRenderer } from "../DetailsForm/FormSectionsRenderer";

export const CirugiaDetailFormFields: React.FC<CirugiaDetailFormFieldsProps> = (props) => {
    return (
        <SectionsWrapper>
            <FormSectionsRenderer {...props} />
        </SectionsWrapper>
    );
};