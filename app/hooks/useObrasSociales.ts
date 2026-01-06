import { useContext, useMemo } from "react";
import { ObrasSocialesContext } from "../context/ObrasSocialesContext";

export const useObrasSociales = () => {
  const context = useContext(ObrasSocialesContext);
  
  if (!context) {
    throw new Error("useObrasSociales must be used within an ObrasSocialesProvider");
  }

  const uniqueObrasSociales = useMemo(() => {
    return Array.from(new Set(context.obrasSociales));
  }, [context.obrasSociales]);

  return {
    ...context,
    obrasSociales: uniqueObrasSociales
  };
};