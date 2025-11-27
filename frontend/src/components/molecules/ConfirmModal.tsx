// frontend/src/components/molecules/ConfirmModal.tsx
import React from "react";
import { createPortal } from "react-dom";
import Button from "@/components/atoms/Button";

interface ConfirmModalProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    onConfirm: () => void;
    onCancel: () => void;
    variant?: "danger" | "primary";
}

const variantStyles = {
    danger: {
        confirmBg: "bg-red-600 hover:bg-red-700",
        confirmText: "text-white",
        iconBg: "bg-red-100 text-red-600",
        title: "text-red-700",
    },
    primary: {
        confirmBg: "bg-blue-600 hover:bg-blue-700",
        confirmText: "text-white",
        iconBg: "bg-blue-100 text-blue-600",
        title: "text-blue-700",
    },
} as const;

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    title,
    message,
    confirmLabel = "Aceptar",
    cancelLabel = "Cancelar",
    onConfirm,
    onCancel,
    variant = "primary",
}) => {
    if (!isOpen) return null;

    const styles = variantStyles[variant];

    return createPortal(
        <div
            className="fixed inset-0 bg-black/40 z-[95] flex items-center justify-center px-4"
            onClick={onCancel}
        >
            <div
                className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 animate-in fade-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-start gap-3">
                    <div
                        className={`w-10 h-10 rounded-2xl flex items-center justify-center ${styles.iconBg}`}
                    >
                        !
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

                    <div className="mt-5 flex justify-end gap-3">
                        <Button
                            onClick={onCancel}
                            variant="secondary"
                            className="px-4 py-2 text-sm rounded-full border border-gray-200"
                        >
                            {cancelLabel}
                        </Button>
                        <Button
                            onClick={onConfirm}
                            variant={variant === "danger" ? "danger" : "primary"}
                            className="px-4 py-2 text-sm rounded-full font-semibold"
                        >
                            {confirmLabel}
                        </Button>
                    </div>
                </div>
            </div>,
        document.body
    );
};

export default ConfirmModal;