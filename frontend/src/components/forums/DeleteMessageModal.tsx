import { useState, useEffect } from 'react';

interface DeleteMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (messageId: number) => void;
  messageId: number | null;
  externalError?: string;
}

/**
 * DeleteMessageModal Component
 *
 * Confirmation modal for deleting a message from a forum.
 */
export const DeleteMessageModal: React.FC<DeleteMessageModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  messageId,
  externalError,
}) => {
  const [error, setError] = useState<string>('');

  // Update local error when external error changes
  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  if (!isOpen || messageId === null) return null;

  const handleConfirm = () => {
    setError('');
    onConfirm(messageId);
  };

  const handleCancel = () => {
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
      onClick={handleCancel}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Warning Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
          ¿Eliminar Mensaje?
        </h2>

        <p className="text-gray-600 mb-6 text-center">
          Esta acción eliminará permanentemente este mensaje del foro.
          Esta acción no se puede deshacer.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors shadow-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 font-medium rounded-lg transition-colors shadow-sm bg-red-500 text-white hover:bg-red-600"
          >
            Eliminar Mensaje
          </button>
        </div>
      </div>
    </div>
  );
};
