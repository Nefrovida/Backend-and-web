// frontend/src/components/molecules/AnalysisTypeModal.tsx
import React from "react";
import { createPortal } from "react-dom";

interface AnalysisTypeModalProps {
    isOpen: boolean;
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}

const AnalysisTypeModal: React.FC<AnalysisTypeModalProps> = ({
    isOpen,
    title,
    onClose,
    children,
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
        onClose();
    };

    const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return createPortal(
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[90]"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
        >
            <div
                className="bg-[#CFE6ED] rounded-3xl shadow-2xl p-6 w-full max-w-lg mx-4"
                onClick={handleContentClick}
            >
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                    {title}
                </h2>

                {children}
            </div>
        </div>,
        document.body
    );
};

export default AnalysisTypeModal;