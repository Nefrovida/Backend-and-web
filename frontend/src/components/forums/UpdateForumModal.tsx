import { useState, useEffect } from 'react';
import { Forum } from '../../types/forum.types';

interface UpdateForumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (forumId: number, publicStatus: boolean) => void;
  forum: Forum | null;
  externalError?: string; // Error from parent component
}

/**
 * 
 * Modal for updating forum visibility.
 * Allows admin to change forum from public to private or vice versa.
 *
 */
export const UpdateForumModal: React.FC<UpdateForumModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  forum,
  externalError,
}) => {
  const [publicStatus, setPublicStatus] = useState(true);
  const [error, setError] = useState<string>('');

  // Update local error when external error changes
  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  // Set initial value when forum changes
  useEffect(() => {
    if (forum) {
      setPublicStatus(forum.public_status);
    }
  }, [forum]);

  if (!isOpen || !forum) return null;

  const handleConfirm = () => {
    setError(''); // Clear previous errors

    onConfirm(forum.forum_id, publicStatus);

    // Reset form
    setPublicStatus(true);
    setError('');
  };

  const handleCancel = () => {
    setPublicStatus(forum.public_status); // Reset to original value
    setError('');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-[#CFE6ED] rounded-3xl shadow-2xl p-8 w-full max-w-md mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-6 text-center">
          Actualizar Visibilidad del Foro
        </h2>

        <p className="text-gray-600 mb-4 text-center">
          <strong>{forum.name}</strong>
        </p>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Visibility Section */}
        <div className="mb-8">
          <h3 className="text-base font-semibold text-gray-800 mb-4 text-center">
            Visibilidad del foro
          </h3>

          {/* Public Option */}
          <label className="flex items-center justify-between bg-white rounded-lg px-4 py-3 mb-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-gray-800 font-medium">Público</span>
            <input
              type="radio"
              name="visibility"
              checked={publicStatus === true}
              onChange={() => setPublicStatus(true)}
              className="w-5 h-5 text-blue-600"
            />
          </label>

          {/* Private Option */}
          <label className="flex items-center justify-between bg-white rounded-lg px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-gray-800 font-medium">Privado</span>
            <input
              type="radio"
              name="visibility"
              checked={publicStatus === false}
              onChange={() => setPublicStatus(false)}
              className="w-5 h-5 text-blue-600"
            />
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
          >
            Cancelar
          </button>
          <button
            onClick={handleConfirm}
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            Actualizar
          </button>
        </div>
      </div>
    </div>
  );
};