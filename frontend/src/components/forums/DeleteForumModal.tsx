import { useState, useEffect } from 'react';
import { Forum } from '../../types/forum.types';

interface DeleteForumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void; // Optional back button to return to config modal
  onConfirm: (forumId: number) => void;
  forum: Forum | null;
  externalError?: string;
}

/**
 * DeleteForumModal Component
 * 
 * Confirmation modal for deleting a forum.
 * Shows warning message and requires confirmation.
 */
export const DeleteForumModal: React.FC<DeleteForumModalProps> = ({
  isOpen,
  onClose,
  onBack,
  onConfirm,
  forum,
  externalError,
}) => {
  const [error, setError] = useState<string>('');
  const [confirmText, setConfirmText] = useState<string>('');

  // Update local error when external error changes
  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  if (!isOpen || !forum) return null;

  const isConfirmValid = confirmText.toLowerCase() === 'eliminar';

  const handleConfirm = () => {
    if (!isConfirmValid) {
      setError('Debes escribir "eliminar" para confirmar');
      return;
    }

    setError(''); // Clear previous errors
    onConfirm(forum.forum_id);

    // Reset form
    setConfirmText('');
    setError('');
  };

  const handleCancel = () => {
    setConfirmText('');
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
        {/* Header with back button */}
        {onBack && (
          <div className="flex justify-start mb-4">
            <button
              onClick={onBack}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
          </div>
        )}

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
          ¿Eliminar Foro?
        </h2>

        <p className="text-gray-600 mb-6 text-center">
          Esta acción eliminará permanentemente el foro <strong>"{forum.name}"</strong> y todo su contenido.
          Esta acción no se puede deshacer.
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Confirmation Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Para confirmar, escribe <strong>"eliminar"</strong> en el campo de abajo:
          </label>
          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="eliminar"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-400 focus:border-transparent"
          />
        </div>

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
            disabled={!isConfirmValid}
            className={`px-6 py-2 font-medium rounded-lg transition-colors shadow-sm ${isConfirmValid
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
          >
            Eliminar Foro
          </button>
        </div>
      </div>
    </div>
  );
};
