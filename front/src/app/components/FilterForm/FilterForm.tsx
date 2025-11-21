import React, { useMemo, useState, useRef, useEffect } from "react";
import { Patient } from "../interfaz/interfaz";
import { FaFilter, FaRedo } from "react-icons/fa"; 

interface FilterFormProps {
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  selectedPatientName: string;
  setSelectedPatientName: React.Dispatch<React.SetStateAction<string>>;
  selectedPractice: string;
  setSelectedPractice: React.Dispatch<React.SetStateAction<string>>;
  selectedObraSocial: string;
  setSelectedObraSocial: React.Dispatch<React.SetStateAction<string>>;
  selectedInstitucion: string;
  setSelectedInstitucion: React.Dispatch<React.SetStateAction<string>>;
  patients: Patient[];
}

const FilterForm: React.FC<FilterFormProps> = ({
  selectedDate,
  setSelectedDate,
  selectedPatientName,
  setSelectedPatientName,
  selectedPractice,
  setSelectedPractice,
  selectedObraSocial,
  setSelectedObraSocial,
  selectedInstitucion,
  setSelectedInstitucion,
  patients,
}) => {
  const formRef = useRef<HTMLDivElement>(null); 
  const [showPatient, setShowPatient] = useState(false);
  const [showPractice, setShowPractice] = useState(false);
  const [showObraSocial, setShowObraSocial] = useState(false);
  const [showInstitucion, setShowInstitucion] = useState(false);
  
  const dataToProcess = Array.isArray(patients) ? patients : [];

  const getUniqueAndSorted = (key: keyof Patient, shouldCleanPracticas: boolean = false) => {
    const values = new Set<string>();
    dataToProcess.forEach((patient) => {
        let value = patient[key] as string;
        
        if (shouldCleanPracticas) {
            value = value.replace(" (U)", ""); 
        }

        if (value) {
            values.add(value);
        }
    });
    return Array.from(values).filter(v => v).sort();
  };

  const patientNames = useMemo(() => getUniqueAndSorted('paciente'), [dataToProcess]);
  const practices = useMemo(() => getUniqueAndSorted('practicas', true), [dataToProcess]);
  const obrasSociales = useMemo(() => getUniqueAndSorted('obraSocial'), [dataToProcess]);
  const instituciones = useMemo(() => getUniqueAndSorted('institucion'), [dataToProcess]);


  const showSetters = useMemo(() => ({
    patient: setShowPatient,
    practice: setShowPractice,
    obraSocial: setShowObraSocial,
    institucion: setShowInstitucion,
  }), []);

  const showStates = useMemo(() => ({
    patient: showPatient,
    practice: showPractice,
    obraSocial: showObraSocial,
    institucion: showInstitucion,
  }), [showPatient, showPractice, showObraSocial, showInstitucion]);
  
 
  const closeAllDropdowns = () => {
    (Object.values(showSetters) as React.Dispatch<React.SetStateAction<boolean>>[]).forEach(setter => setter(false));
  };



  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (formRef.current && !formRef.current.contains(event.target as Node)) {
            closeAllDropdowns();
        }
    };

 
    document.addEventListener("mousedown", handleClickOutside);
    

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const filterSuggestions = (list: string[], selectedValue: string): string[] => {
      if (!selectedValue) {
          return list;
      }
      return list.filter(item =>
          item.toLowerCase().includes(selectedValue.toLowerCase())
      );
  };


  const filteredPatientNames = useMemo(() => {
      return filterSuggestions(patientNames, selectedPatientName);
  }, [patientNames, selectedPatientName]);

  const filteredPracticeNames = useMemo(() => {
      return filterSuggestions(practices, selectedPractice);
  }, [practices, selectedPractice]);
  
  const filteredObraSocialNames = useMemo(() => {
      return filterSuggestions(obrasSociales, selectedObraSocial);
  }, [obrasSociales, selectedObraSocial]);

  const filteredInstitucionNames = useMemo(() => {
      return filterSuggestions(instituciones, selectedInstitucion);
  }, [instituciones, selectedInstitucion]);


 
  const handleFocus = (field: keyof typeof showSetters) => {
    (Object.keys(showSetters) as (keyof typeof showSetters)[]).forEach(key => {
        const setter = showSetters[key];
        setter(key === field);
    });
  };

  const handleResetFilters = () => {
    setSelectedDate('');
    setSelectedPatientName('');
    setSelectedPractice('');
    setSelectedObraSocial('');
    setSelectedInstitucion('');
    closeAllDropdowns();
  };
  

  const handleSuggestionClick = (
    name: string, 
    setSelected: React.Dispatch<React.SetStateAction<string>>, 
  ) => {
    setSelected(name);
    closeAllDropdowns(); 
  };

 
  const AutocompleteInput = ({
    label,
    value,
    setValue,
    fieldKey,
    filteredNames,
    placeholder,
    dataTestId
  }: {
    label: string,
    value: string,
    setValue: React.Dispatch<React.SetStateAction<string>>,
    fieldKey: keyof typeof showSetters,
    filteredNames: string[],
    placeholder: string,
    dataTestId: string
  }) => {
    
    const isShowing = showStates[fieldKey]; 

    const handleBlur = () => {
        setTimeout(() => {
             if (showStates[fieldKey]) {
                showSetters[fieldKey](false);
             }
        }, 200);
    };

    return (
        <div className="flex flex-col relative" data-testid={dataTestId}>
            <label className="text-xs font-medium text-gray-300 mb-1">{label}</label>
            <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onFocus={() => handleFocus(fieldKey)} 
                onBlur={handleBlur} 
                className="w-full p-2 border border-gray-500 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder={placeholder}
                title={`Escriba o seleccione ${label.toLowerCase()}`}
            />
            
            {isShowing && (
                <div 
                    className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 shadow-lg 
                            max-h-60 overflow-y-auto" 
                    style={{ top: '100%', left: 0 }}
                >
                    {filteredNames.length > 0 ? (
                        filteredNames.map((name, index) => (
                            <div
                                key={index}
                                onMouseDown={() => handleSuggestionClick(name, setValue)}
                                className="p-2 text-sm text-gray-800 cursor-pointer hover:bg-green-100 transition-colors"
                            >
                                {name}
                            </div>
                        ))
                    ) : (
                        <div className="p-2 text-sm text-gray-500">
                            No hay coincidencias. Puede ingresar el valor.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
  };
  
  return (
    <div ref={formRef} className="bg-gray-700 p-4 rounded-lg shadow-xl border border-gray-600">
      <div className="flex items-center mb-3 text-white">
        <FaFilter className="mr-2 text-green-400" />
        <h3 className="font-semibold text-lg">Opciones de Filtrado</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
        

        <div className="flex flex-col">
            <label className="text-xs font-medium text-gray-300 mb-1">Fecha</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="p-2 border border-gray-500 rounded-md text-sm text-black focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Filtrar por fecha"
            />
        </div>


        <AutocompleteInput
            label="Paciente"
            value={selectedPatientName}
            setValue={setSelectedPatientName}
            fieldKey="patient"
            filteredNames={filteredPatientNames}
            placeholder="Escriba o seleccione paciente..."
            dataTestId="filter-paciente"
        />
        
  
        <AutocompleteInput
            label="Práctica"
            value={selectedPractice}
            setValue={setSelectedPractice}
            fieldKey="practice"
            filteredNames={filteredPracticeNames}
            placeholder="Escriba o seleccione práctica..."
            dataTestId="filter-practice"
        />
        
  
        <AutocompleteInput
            label="Obra Social"
            value={selectedObraSocial}
            setValue={setSelectedObraSocial}
            fieldKey="obraSocial"
            filteredNames={filteredObraSocialNames}
            placeholder="Escriba o seleccione obra social..."
            dataTestId="filter-obrasocial"
        />
    

        <AutocompleteInput
            label="Institución"
            value={selectedInstitucion}
            setValue={setSelectedInstitucion}
            fieldKey="institucion"
            filteredNames={filteredInstitucionNames}
            placeholder="Escriba o seleccione institución..."
            dataTestId="filter-institucion"
        />


        <button
          type="button"
          onClick={handleResetFilters}
          className="flex items-center justify-center p-2 mt-4 lg:mt-0 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition duration-200 shadow-md focus:outline-none focus:ring-2 focus:ring-red-500"
          title="Resetear todos los filtros"
        >
            <FaRedo className="mr-1" />
            Limpiar
        </button>
        
      </div>
    </div>
  );
};

export default FilterForm;