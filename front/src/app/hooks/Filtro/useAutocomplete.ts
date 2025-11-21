import { useRef, useEffect } from "react";

export function useAutocomplete({
  isShowing,
  value,
  setter,
}: {
  isShowing: boolean;
  value: string;
  setter: (val: boolean) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Mantener foco cuando se abre
  useEffect(() => {
    if (isShowing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.setSelectionRange(value.length, value.length);
    }
  }, [isShowing, value]);

  // Cerrar al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setter(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setter]);

  return { wrapperRef, inputRef };
}
