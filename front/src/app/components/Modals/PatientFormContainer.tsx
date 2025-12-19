"use client";

import React from 'react';
import { PatientFormFields } from "../PatientFormFields";
import { AddOptionButtons } from "./AddOptionButtons";
import { ErrorDisplay } from "../ErrorDisplay";
import { FormActions } from "../FormActions";
import { PatientFormLogic, PatientModalManager } from "../interfaz/pacientes.types";

interface PatientFormContainerProps {
    form: PatientFormLogic;
    manager: PatientModalManager;
    obrasSociales: string[];
    onClose: () => void;
}

export const PatientFormContainer: React.FC<PatientFormContainerProps> = ({
    form,
    manager,
    obrasSociales,
    onClose
}) => {
    return (
        <form onSubmit={form.handleSubmit} className="space-y-6 overflow-visible">
            <PatientFormFields
                formData={form.formData}
                obrasSociales={obrasSociales}
                onInputChange={form.handleInputChange}
                onCheckboxChange={form.handleCheckboxChange}
                suggestions={form.suggestions}
                showSuggestions={form.showSuggestions}
                onSelectPatient={form.handleSelectPatient}
            />
            
            <AddOptionButtons onOpenAddModal={manager.openAddModal} />
            
            <ErrorDisplay error={form.error} />
            <FormActions onCancel={onClose} submitText="Agregar" />
        </form>
    );
};