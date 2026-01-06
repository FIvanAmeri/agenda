"use client";

import React, { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import VerCirugiasContent from "../components/VerCirugia/VerCirugiasContent";
import { User } from "../components/interfaz/interfaz";

export default function CirugiasPage() {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showCirugiaModal, setShowCirugiaModal] = useState(false);

    const [user] = useState<User | null>(null); 

    if (!user) return null;

    return (
        <MainLayout 
            user={user} 
            showAddModal={showAddModal} 
            setShowAddModal={setShowAddModal} 
            setShowCirugiaModal={setShowCirugiaModal}
        >
            <VerCirugiasContent user={user} />
        </MainLayout>
    );
}