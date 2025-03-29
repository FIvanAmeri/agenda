import React from 'react';

interface ErrorDisplayProps {
  error: string | null;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  if (!error) return null;

  return (
    <div className="col-span-full text-red-500 text-sm p-2 bg-red-50 rounded-md">
      {error}
    </div>
  );
};