"use client";

import AuroraBackground from "./components/AuroraBackground";
import Form from "./Form/page";
import { ObrasSocialesProvider } from "./context/ObrasSocialesContext";

export default function Page() {
  return (
    <ObrasSocialesProvider>
      <div className="relative min-h-screen">
        <AuroraBackground />
        <main className="main-with-aurora flex items-center justify-center">
          <Form />
        </main>
      </div>
    </ObrasSocialesProvider>
  );
}
