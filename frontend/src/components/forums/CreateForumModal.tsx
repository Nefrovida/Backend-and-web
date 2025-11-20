import { useState, useEffect } from 'react';
import { CreateForumData } from '../../types/forum.types';

interface CreateForumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: CreateForumData) => void;
  externalError?: string; // Error from parent component
}

/**
 * CreateForumModal Component
 * 
 * Modal centered on screen for creating a new forum.
 * Allows user to select visibility (Public/Private) and input forum details.
 * 
 * Design based on Figma mockup:
 * - Light blue background (#CFE6ED)
 * - Large rounded corners
 * - Soft shadow
 * - Radio buttons for visibility
 * - Cancel and Accept buttons
 */
export const CreateForumModal: React.FC<CreateForumModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  externalError,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [publicStatus, setPublicStatus] = useState(true);
  const [error, setError] = useState<string>('');

  const MAX_NAME_LENGTH = 100;
  const MAX_DESCRIPTION_LENGTH = 255;

  // Update local error when external error changes
  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setError(''); // Clear previous errors

    if (!name.trim()) {
      setError('Por favor ingresa un nombre para el foro');
      return;
    }

    if (name.length < 3) {
      setError('El nombre debe tener al menos 3 caracteres');
      return;
    }

    onConfirm({
      name: name.trim(),
      description: description.trim(),
      public_status: publicStatus,
    });

    // Reset form
    setName('');
    setDescription('');
    setPublicStatus(true);
    setError('');
  };

  const handleCancel = () => {
    setName('');
    setDescription('');
    setPublicStatus(true);
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
          Crear Nuevo Foro
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Forum Name Input */}
        <div className="mb-4">
          <label htmlFor="forumName" className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del foro
          </label>
          <input
            id="forumName"
            type="text"
            value={name}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= MAX_NAME_LENGTH) {
                setName(value);
                setError(''); // Clear error on input
              }
            }}
            maxLength={MAX_NAME_LENGTH}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            placeholder="Ej: Foro de Nutrición"
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {name.length}/{MAX_NAME_LENGTH} caracteres
          </div>
        </div>

        {/* Forum Description Input */}
        <div className="mb-6">
          <label htmlFor="forumDescription" className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            id="forumDescription"
            value={description}
            onChange={(e) => {
              const value = e.target.value;
              if (value.length <= MAX_DESCRIPTION_LENGTH) {
                setDescription(value);
                setError(''); // Clear error on input
              }
            }}
            maxLength={MAX_DESCRIPTION_LENGTH}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent resize-none"
            placeholder="Breve descripción del foro"
            rows={3}
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {description.length}/{MAX_DESCRIPTION_LENGTH} caracteres
          </div>
        </div>

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
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
};
