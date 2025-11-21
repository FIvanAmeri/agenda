"use client";

import React from 'react';
import MainLayout from '../../layout/MainLayout';
import PrincipalContent from '../components/content/PrincipalContent';


export default function PrincipalPage() {
    return (
        <MainLayout>
            {(props) => <PrincipalContent {...props} />}
        </MainLayout>
    );
}