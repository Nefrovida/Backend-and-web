import { useState, useEffect } from 'react';
import { Forum } from '../../types/forum.types';

interface Administrator {
  admin_id: number;
  user_id: number;
  username: string;
  email: string;
  status: 'active' | 'inactive';
}

interface AdministratorsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void; // Optional back button to return to config modal
  forum: Forum | null;
  externalError?: string;
}

/**
 * AdministratorsModal Component
 * 
 * Modal for managing forum administrators.
 * Shows current administrators and allows adding new ones.
 * Based on the mobile interface design but adapted for web.
 */
export const AdministratorsModal: React.FC<AdministratorsModalProps> = ({
  isOpen,
  onClose,
  onBack,
  forum,
  externalError,
}) => {
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showAddSection, setShowAddSection] = useState(false);

  // Update local error when external error changes
  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  // Fetch administrators when modal opens
  useEffect(() => {
    if (isOpen && forum) {
      fetchAdministrators();
    }
  }, [isOpen, forum]);

  const fetchAdministrators = async () => {
    if (!forum) return;

    try {
      setIsLoading(true);
      const response = await fetch(`/api/forums/${forum.forum_id}/administrators`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al cargar los administradores');
      }

      const data = await response.json();
      setAdministrators(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching administrators:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdministrator = async (username: string) => {
    if (!forum || !username.trim()) return;

    try {
      const response = await fetch(`/api/forums/${forum.forum_id}/administrators`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar administrador');
      }

      const newAdmin = await response.json();
      setAdministrators([...administrators, newAdmin]);
      setSearchTerm('');
      setShowAddSection(false);
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding administrator:', err);
    }
  };

  const handleRemoveAdministrator = async (adminId: number) => {
    if (!forum) return;

    try {
      const response = await fetch(`/api/forums/${forum.forum_id}/administrators/${adminId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al eliminar administrador');
      }

      setAdministrators(administrators.filter(admin => admin.admin_id !== adminId));
    } catch (err: any) {
      setError(err.message);
      console.error('Error removing administrator:', err);
    }
  };

  if (!isOpen || !forum) return null;

  // Filter administrators based on search
  const filteredAdministrators = administrators.filter(admin =>
    admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]">
      <div
        className="bg-[#CFE6ED] rounded-3xl shadow-2xl p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          {onBack && (
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
          )}
          <h2 className="text-lg font-semibold text-gray-800">
            Administradores
          </h2>
          <div className="w-8"> {/* Spacer for centering */}</div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Search Section */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Asignar nuevo admin"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setShowAddSection(true)}
              className="w-full px-4 py-3 pl-10 bg-white rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-400 focus:border-transparent"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Add Administrator Button */}
          {showAddSection && searchTerm.trim() && (
            <div className="mt-2">
              <button
                onClick={() => handleAddAdministrator(searchTerm)}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Agregar "{searchTerm}" como administrador
              </button>
            </div>
          )}
        </div>

        {/* Current Administrators Section */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Actuales</h3>
          
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-600 text-sm">Cargando administradores...</p>
            </div>
          ) : filteredAdministrators.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600 text-sm">
                {searchTerm ? 'No se encontraron administradores' : 'No hay administradores asignados'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAdministrators.map((admin) => (
                <div key={admin.admin_id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-3">
                    {/* Avatar placeholder */}
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{admin.username}</p>
                      <p className="text-xs text-gray-500">{admin.email}</p>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex items-center space-x-2">
                    {/* Settings button */}
                    <button
                      onClick={() => {/* TODO: Implement settings */}}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-gray-500"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                        />
                      </svg>
                    </button>
                    
                    {/* Remove button */}
                    <button
                      onClick={() => handleRemoveAdministrator(admin.admin_id)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-red-500"
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
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
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
