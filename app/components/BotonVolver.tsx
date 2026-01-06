"use client";

import { useRouter } from "next/navigation";
import React from "react";

interface BotonVolverProps {
  texto?: string;
  className?: string;
}

const BotonVolver: React.FC<BotonVolverProps> = ({ texto = "Volver al inicio", className }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push("/");
  };

  return (
    <button
      onClick={handleClick}
      className={` w-full px-4 py-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700 transition ${className}`}
    >
      {texto}
    </button>
  );
};

export default BotonVolver;
