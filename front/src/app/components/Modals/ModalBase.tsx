import React, { ReactNode } from 'react';

interface ModalBaseProps {
  children: ReactNode;
  title: string;
  onClose: () => void;
}

export const ModalBase: React.FC<ModalBaseProps> = ({ children, title, onClose }) => {
  return (
    <div 
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-r from-blue-600 to-teal-600 p-6 rounded-lg shadow-lg w-full max-w-6xl mx-auto overflow-y-auto"
        style={{ maxHeight: '90vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 focus:outline-none"
            aria-label="Cerrar modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};