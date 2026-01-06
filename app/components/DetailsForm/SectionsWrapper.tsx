import React from "react";

interface SectionsWrapperProps {
    children: React.ReactNode;
}

export const SectionsWrapper: React.FC<SectionsWrapperProps> = ({ children }) => {
    return (
        <div className="space-y-6">
            {children}
        </div>
    );
};