import React, { useEffect, useRef, RefObject } from 'react';


interface UseAutocompleteProps {
    isShowing: boolean;
    value: string;
    setter: React.Dispatch<React.SetStateAction<boolean>>;
}

interface UseAutocompleteResult {
    wrapperRef: RefObject<HTMLDivElement>;
    inputRef: RefObject<HTMLInputElement>;
}


export const useAutocomplete = ({ setter, isShowing, value }: UseAutocompleteProps): UseAutocompleteResult => {
    
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
                setter(false); 
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [setter]);

    return { wrapperRef, inputRef };
};