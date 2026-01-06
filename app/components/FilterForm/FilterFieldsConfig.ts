import { FiltrosCirugia } from "../../components/interfaz/tipos-cirugia";
import { FilterFieldKey } from "../../hooks/Filtro/useFilterDropdowns";

export interface AutocompleteConfig {
    label: string;
    valueKey: keyof FiltrosCirugia;
    fieldKey: FilterFieldKey;
    placeholder: string;
    testId: string;
}

export const AUTOCOMPLETE_FIELDS_CONFIG: AutocompleteConfig[] = [
    {
        label: "Paciente",
        valueKey: "selectedPatientName",
        fieldKey: "patient",
        placeholder: "Paciente...",
        testId: "filter-paciente"
    },
    {
        label: "Tipo Cirugía",
        valueKey: "selectedTipoCirugia",
        fieldKey: "practice",
        placeholder: "Tipo...",
        testId: "filter-tipo-cirugia"
    },
    {
        label: "Médico",
        valueKey: "selectedMedico",
        fieldKey: "institucion",
        placeholder: "Médico...",
        testId: "filter-medico"
    },
    {
        label: "Obra Social",
        valueKey: "selectedObraSocial",
        fieldKey: "obraSocial",
        placeholder: "OS...",
        testId: "filter-obra-social"
    }
];