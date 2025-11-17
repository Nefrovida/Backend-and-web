import { useState } from 'react';
import { Forum } from '../../types/forum.types';

interface ForumConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  forum: Forum | null;
  onVisibilityClick: (forum: Forum) => void;
  onMembersClick: (forum: Forum) => void;
  onAdministratorsClick: (forum: Forum) => void;
  onDeleteClick: (forum: Forum) => void;
}

/**
 * ForumConfigModal Component
 * 
 * Main configuration modal for forums showing all available options:
 * - Visibilidad (Visibility)
 * - Miembros (Members)
 * - Administradores (Administrators)
 * - Eliminar Foro (Delete Forum)
 */
export const ForumConfigModal: React.FC<ForumConfigModalProps> = ({
  isOpen,
  onClose,
  forum,
  onVisibilityClick,
  onMembersClick,
  onAdministratorsClick,
  onDeleteClick,
}) => {
  if (!isOpen || !forum) return null;

  const menuItems = [
    {
      label: 'Visibilidad',
      icon: (
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
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
      ),
      onClick: () => onVisibilityClick(forum),
    },
    {
      label: 'Miembros',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-600"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
          />
        </svg>
      ),
      onClick: () => onMembersClick(forum),
    },
    {
      label: 'Administradores',
      icon: (
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
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      onClick: () => onAdministratorsClick(forum),
    },
    {
      label: 'Eliminar Foro',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-red-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      ),
      onClick: () => onDeleteClick(forum),
      isDestructive: true,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-[#CFE6ED] rounded-3xl shadow-2xl p-6 w-full max-w-sm mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-800">
            Configuración
          </h2>
          <button
            onClick={onClose}
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Forum Name */}
        <div className="mb-6">
          <p className="text-sm text-gray-600 text-center">
            <strong>{forum.name}</strong>
          </p>
        </div>

        {/* Menu Items */}
        <div className="space-y-2">
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => {
                onClose();
                item.onClick();
              }}
              className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-left ${
                item.isDestructive
                  ? 'bg-white hover:bg-red-50 text-red-600 hover:text-red-700'
                  : 'bg-white hover:bg-gray-50 text-gray-800'
              }`}
            >
              <span className={`font-medium ${item.isDestructive ? 'text-red-600' : 'text-gray-800'}`}>
                {item.label}
              </span>
              <div className="flex items-center">
                {item.icon}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-400 ml-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Date Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            {new Date().toLocaleDateString('es-ES', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  );
};
