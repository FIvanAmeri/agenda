"use client";

import React, { RefObject } from 'react';

interface ModalPortalLayoutProps {
    children: React.ReactNode;
    modalRef: RefObject<HTMLDivElement>;
}

export const ModalPortalLayout: React.FC<ModalPortalLayoutProps> = ({ children, modalRef }) => {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-hidden">
            <div className="md:ml-64 w-full max-w-sm md:max-w-xl lg:max-w-4xl mx-auto" ref={modalRef}>
                {children}
            </div>
        </div>
    );
};