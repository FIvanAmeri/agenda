"use client";

import React from 'react';
import MainLayout from '../../layout/MainLayout';
import PrincipalContent from '../components/content/PrincipalContent';
import AddCirugiaModal from '../components/Cirugia/AddCirugiaModal';

export default function PrincipalPage() {
    return (
        <MainLayout>
            {(props) => (
                <>
                    <PrincipalContent {...props} />

                    {props.showCirugiaModal && (
                        <AddCirugiaModal
                            user={props.user}
                            onClose={() => props.setShowCirugiaModal(false)}
                            onAdded={() => props.setShowCirugiaModal(false)}
                        />
                    )}
                </>
            )}
        </MainLayout>
    );
}