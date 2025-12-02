"use client";

import React from "react";
import MainLayout from "../../layout/MainLayout";
import VerCirugiasContent from "../components/VerCirugia/VerCirugiasContent";

export default function CirugiasPage() {
    return (
        <MainLayout>
            {(props) => (
                <VerCirugiasContent user={props.user} />
            )}
        </MainLayout>
    );
}
