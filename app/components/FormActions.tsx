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
        <div className="col-span-full flex justify-end space-x-4 pt-4 border-t border-[#1f3b47] mt-6">
            <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 border border-gray-600 text-gray-300 rounded-md hover:bg-[#1a4553] transition duration-200"
            >
                {cancelText}
            </button>
            <button
                type="submit"
                className="px-6 py-2 bg-[#0c4a34] text-white font-semibold rounded-md hover:bg-[#1f5666] transition duration-200"
            >
                {submitText}
            </button>
        </div>
    );
};