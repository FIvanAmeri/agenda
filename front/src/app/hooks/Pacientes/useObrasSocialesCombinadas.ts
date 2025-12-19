import { useMemo } from 'react';
import { useObrasSociales } from '../useObrasSociales';

interface UseObrasSocialesCombinadasProps {
    extraObrasSociales: string[];
}

export const useObrasSocialesCombinadas = ({ extraObrasSociales }: UseObrasSocialesCombinadasProps) => {
    const { obrasSociales: initialObrasSociales } = useObrasSociales();

    const combinedObrasSociales: string[] = useMemo((): string[] => {
        const set: Set<string> = new Set([...initialObrasSociales, ...extraObrasSociales]);
        return Array.from(set).sort((a: string, b: string): number => a.localeCompare(b));
    }, [initialObrasSociales, extraObrasSociales]);

    return combinedObrasSociales;
};