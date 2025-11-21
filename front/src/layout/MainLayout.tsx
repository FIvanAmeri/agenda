"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../app/components/Sidebar';
import useAuth from '../app/hooks/useAuth';
import { User, Patient } from '../app/components/interfaz/interfaz';


interface ContentProps {
    user: User;
    showAddModal: boolean;
    setShowAddModal: (show: boolean) => void;
    showEditModal: boolean;
    setShowEditModal: (show: boolean) => void;
    selectedPatient: Patient | null;
    setSelectedPatient: (patient: Patient | null) => void;
}

interface MainLayoutProps {
  children: (props: ContentProps) => React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const router = useRouter();
  const { token, loading: authLoading } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);



  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);


  useEffect(() => {
    if (!authLoading && !token) {
      router.replace("/");
    }
  }, [authLoading, token, router]);
  

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.replace("/");
  };
  

  if (authLoading || !user) {
    return <div className="text-center text-gray-300 mt-10">Cargando...</div>;
  }
  if (!token) {
    return null;
  }


  return (
    <div className="flex bg-cyan-900 min-h-screen">
      

      <Sidebar 
        handleLogout={handleLogout} 
        setShowAddModal={setShowAddModal}
        userName={user.usuario}
      />
      
     
      <main className="flex-1 ml-64 p-0"> 
        {children({ 
            user, 
            showAddModal, 
            setShowAddModal,
            showEditModal, 
            setShowEditModal,
            selectedPatient,
            setSelectedPatient,
        })}
      </main>
    </div>
  );
};

export default MainLayout;