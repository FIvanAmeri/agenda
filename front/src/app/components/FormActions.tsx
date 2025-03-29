import React from 'react';

interface FormActionsProps {
  onCancel: () => void;
  submitText?: string;
  cancelText?: string;
}

export const FormActions: React.FC<FormActionsProps> = ({ 
  onCancel, 
  submitText = 'Guardar', 
  cancelText = 'Cancelar' 
}) => {
  return (
    <div className="col-span-full flex flex-col sm:flex-row justify-between gap-3 mt-4">
      <button
        type="button"
        onClick={onCancel}
        className="py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 flex-1"
      >
        {cancelText}
      </button>
      <button
        type="submit"
        className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex-1"
      >
        {submitText}
      </button>
    </div>
  );
};