"use client";

import React, { ReactNode, useCallback, useEffect } from "react";

interface Props {
    title?: string;
    children: ReactNode;
    onClose: () => void;
    contentClassName?: string;
}

const ModalBase: React.FC<Props> = ({ title, children, onClose, contentClassName }) => {
    const close = useCallback(() => onClose(), [onClose]);

    useEffect(() => {
        const h = (e: KeyboardEvent) => {
            if (e.key === "Escape") close();
        };
        window.addEventListener("keydown", h);
        return () => window.removeEventListener("keydown", h);
    }, [close]);
    
    const finalContentClassName = contentClassName || "bg-white text-black";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/50" onClick={close} />
            <div className={`relative rounded-md shadow-lg w-full max-w-2xl p-6 z-10 ${finalContentClassName}`}>
                {title && <h3 className="text-lg font-semibold mb-4">{title}</h3>}
                {children}
            </div>
        </div>
    );
};

export default ModalBase;