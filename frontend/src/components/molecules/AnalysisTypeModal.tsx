// frontend/src/components/molecules/AnalysisTypeModal.tsx
import React from "react";

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
        // Cualquier click en el fondo cierra el modal
        e.stopPropagation();
        onClose();
    };

    const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // Evita que el click dentro cierre el modal
        e.stopPropagation();
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
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
        </div>
    );
};

export default AnalysisTypeModal;