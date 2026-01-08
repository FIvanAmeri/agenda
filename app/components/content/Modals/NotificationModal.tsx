"use client";

import React from "react";

interface NotificationState {
    show: boolean;
    message: string;
    type: "success" | "error";
}

interface Props {
    notification: NotificationState;
    onClose: () => void;
}

export const NotificationModal: React.FC<Props> = ({ notification, onClose }) => {
    if (!notification.show) return null;
    const bgColor: string = notification.type === "success" ? "bg-[#004d40]" : "bg-red-700";
    const borderColor: string = notification.type === "success" ? "border-[#009688]" : "border-red-500";
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-100 flex justify-center items-center p-4" onClick={onClose}>
            <div className={`w-full max-w-md p-6 rounded-lg shadow-2xl text-white border-2 ${bgColor} ${borderColor}`} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-semibold">{notification.type === "success" ? "Operación Exitosa" : "Error"}</h3>
                    <button onClick={onClose} className="text-white hover:text-gray-300 text-2xl leading-none">&times;</button>
                </div>
                <p className="text-lg mb-6">{notification.message}</p>
                <div className="flex justify-end">
                    <button onClick={onClose} className={`px-6 py-2 rounded-md font-semibold ${notification.type === "success" ? "bg-[#009688] hover:bg-[#00796b]" : "bg-red-500 hover:bg-red-600"} transition duration-200`}>Aceptar</button>
                </div>
            </div>
        </div>
    );
};