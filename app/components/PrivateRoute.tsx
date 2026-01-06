"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isClient || isAuthenticated === null) {
    return <div>Cargando...</div>;
  }

  return <>{children}</>; 
};

export default PrivateRoute;
