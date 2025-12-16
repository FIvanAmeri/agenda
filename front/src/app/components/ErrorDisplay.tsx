import React from 'react';

interface ErrorDisplayProps {
    error: string | null;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
    if (!error) return null;

    return (
        <div className="p-3 bg-red-700 text-white rounded-md text-sm font-medium">
            Error: {error}
        </div>
    );
};