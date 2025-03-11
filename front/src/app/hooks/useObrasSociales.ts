
import { useContext } from "react";
import { ObrasSocialesContext } from "../context/ObrasSocialesContext";


export const useObrasSociales = () => {
  const context = useContext(ObrasSocialesContext);
  if (!context) {
    throw new Error("useObrasSociales must be used within an ObrasSocialesProvider");
  }
  return context;
};
