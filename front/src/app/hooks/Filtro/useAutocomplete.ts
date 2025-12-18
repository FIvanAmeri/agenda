import { useEffect, useRef, RefObject } from 'react';

interface UseAutocompleteProps {
    isShowing: boolean;
    value: string;
    setter: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UseAutocompleteResult {
    wrapperRef: RefObject<HTMLDivElement | null>;
    inputRef: RefObject<HTMLInputElement | null>;
}

export const useAutocomplete = ({ setter, isShowing }: UseAutocompleteProps): UseAutocompleteResult => {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!isShowing) return;

        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (wrapperRef.current && !wrapperRef.current.contains(target)) {
                setter(false);
            }
        };

        document.addEventListener('click', handleClickOutside, true);

        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, [isShowing, setter]);

    return { wrapperRef, inputRef };
};