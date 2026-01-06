import { useEffect, RefObject } from 'react';

interface UseModalEventsProps {
    onClose: () => void;
    modalRef: RefObject<HTMLDivElement | null>;
    isOpenExtraModal: boolean;
    setOpenExtraModal: (value: boolean) => void;
    onOutsideClick?: () => void;
}

export const useModalEvents = ({
    onClose,
    modalRef,
    isOpenExtraModal,
    setOpenExtraModal,
    onOutsideClick
}: UseModalEventsProps) => {
    useEffect((): () => void => {
        const handleKeyDown = (event: KeyboardEvent): void => {
            if (event.key === 'Escape') {
                if (isOpenExtraModal) {
                    setOpenExtraModal(false);
                } else {
                    onClose();
                }
            }
        };

        const handleClickOutside = (event: MouseEvent): void => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                if (onOutsideClick) onOutsideClick();
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        document.addEventListener("mousedown", handleClickOutside);
        
        return (): void => {
            document.removeEventListener("keydown", handleKeyDown);
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose, modalRef, isOpenExtraModal, setOpenExtraModal, onOutsideClick]);
};