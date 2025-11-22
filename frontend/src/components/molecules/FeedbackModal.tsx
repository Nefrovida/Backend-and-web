// frontend/src/components/molecules/FeedbackModal.tsx
import React from "react";
import { createPortal } from "react-dom";
import Button from "@/components/atoms/Button";

interface FeedbackModalProps {
    isOpen: boolean;
    variant?: "success" | "error" | "info";
    title: string;
    message: string;
    onClose: () => void;
}

const variantStyles = {
    success: {
        border: "border-green-100",
        iconBg: "bg-green-100 text-green-600",
        title: "text-green-700",
    },
    error: {
        border: "border-red-100",
        iconBg: "bg-red-100 text-red-600",
        title: "text-red-700",
    },
    info: {
        border: "border-blue-100",
        iconBg: "bg-blue-100 text-blue-600",
        title: "text-blue-700",
    },
} as const;

const FeedbackModal: React.FC<FeedbackModalProps> = ({
    isOpen,
    variant = "info",
    title,
    message,
    onClose,
}) => {
    if (!isOpen) return null;

    const styles = variantStyles[variant];

    return createPortal(
        <>
            <div
                className="fixed inset-0 bg-black/40 z-[95]"
                onClick={onClose}
            />

            {/* Modal content */}
            <div
                className="fixed inset-0 z-[96] flex items-center justify-center px-4"
                onClick={(e) => e.stopPropagation()}
            >
                <div
                    className={`
            w-full max-w-sm bg-white rounded-2xl shadow-2xl 
            border p-6 animate-in fade-in zoom-in-95 duration-200
            ${styles.border}`}
                >
                    <div className="flex items-start gap-3">
                        <div
                            className={`w-10 h-10 rounded-2xl flex items-center justify-center ${styles.iconBg}`}
                        >
                            {variant === "success" && "✓"}
                            {variant === "error" && "!"}
                            {variant === "info" && "i"}
                        </div>

                        <div className="flex-1">
                            <h2 className={`text-base font-semibold ${styles.title}`}>
                                {title}
                            </h2>
                            <p className="mt-1 text-sm text-gray-700 whitespace-pre-line">
                                {message}
                            </p>
                        </div>
                    </div>

                    <div className="mt-5 flex justify-end">
                        <Button
                            onClick={onClose}
                            className="px-4 py-2 text-sm rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
                            variant="secondary"
                        >
                            Cerrar
                        </Button>
                    </div>
                </div>
            </div>
        </>,
        document.body
    );
};

export default FeedbackModal;