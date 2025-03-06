"use client";

import Form from './Form/page';
import { ObrasSocialesProvider } from "./context/ObrasSocialesContext";

export default function Page() {
  return (
    <ObrasSocialesProvider>
      <div className="min-h-screen flex items-center justify-center">
        <Form />
      </div>
    </ObrasSocialesProvider>
  );
}
