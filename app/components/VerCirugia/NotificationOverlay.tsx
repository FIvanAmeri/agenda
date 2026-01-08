"use client";

import React from "react";

interface NotificationOverlayProps {
    message: string;
    type: "success" | "error";
}

const NotificationOverlay: React.FC<NotificationOverlayProps> = ({ message, type }) => {
    return (
        <div className="fixed inset-0 flex items-center justify-center z-9999 pointer-events-none">
            <div
                className={`px-8 py-4 rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.5)] flex items-center border backdrop-blur-md animate-in zoom-in duration-200 ${
                    type === "success"
                        ? "bg-emerald-600/90 border-emerald-400"
                        : "bg-rose-600/90 border-rose-400"
                }`}
            >
                <p className="font-black text-white uppercase text-sm md:text-base tracking-widest">
                    {message}
                </p>
            </div>
        </div>
    );
};

export default NotificationOverlay;