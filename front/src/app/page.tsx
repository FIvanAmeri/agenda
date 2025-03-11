"use client";

import Form from './Form/page'; // Aquí importas tu componente de formulario.
import { ObrasSocialesProvider } from "./context/ObrasSocialesContext"; // Asegúrate de que el contexto esté bien importado.

export default function Page() {
  return (
    <ObrasSocialesProvider>
      <div className="min-h-screen flex items-center justify-center">
        <Form /> {/* Aquí es donde se incluye el formulario o cualquier componente relevante */}
      </div>
    </ObrasSocialesProvider>
  );
}
