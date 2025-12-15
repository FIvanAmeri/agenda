import React, { useEffect, useRef, RefObject } from 'react';


export const useAutocomplete = (
    setter: React.Dispatch<React.SetStateAction<boolean>>, 
): RefObject<HTMLDivElement> => {
    
    const wrapperRef = useRef<HTMLDivElement>(null);

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

    return wrapperRef;
};