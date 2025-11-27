import { useState, useEffect } from 'react';
import { Forum } from '../../types/forum.types';

const API_BASE = (import.meta as any).env?.VITE_APP_API_URL || 'http://localhost:3001/api';

interface Administrator {
  user_id: string;
  name: string;
  parent_last_name: string;
  maternal_last_name: string;
  username: string;
  phone_number: string;
  registration_date: string;
  role: {
    role_name: string;
  };
}

interface ForumAdministrator {
  user_id: string;
  name: string;
  parent_last_name: string;
  maternal_last_name: string;
  username: string;
  phone_number: string;
  registration_date: string;
  forum_role: string;
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
  const [forumAdministrators, setForumAdministrators] = useState<ForumAdministrator[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForum, setIsLoadingForum] = useState(false);
  const [error, setError] = useState<string>('');
  const [showAddSection, setShowAddSection] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);

  // Update local error when external error changes
  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  // Fetch administrators when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchAdministrators();
      if (forum?.forum_id) {
        fetchForumAdministrators();
      }
    }
  }, [isOpen, currentPage, forum?.forum_id]);

  const fetchAdministrators = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch(`${API_BASE}/forums/admin-users?page=${currentPage}&limit=10`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al cargar los administradores');
      }

      const data = await response.json();
      setAdministrators(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalRecords(data.pagination?.totalRecords || 0);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching administrators:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForumAdministrators = async () => {
    if (!forum?.forum_id) return;

    try {
      setIsLoadingForum(true);
      setError('');

      const response = await fetch(`${API_BASE}/forums/${forum.forum_id}/administrators`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al cargar los administradores del foro');
      }

      const data = await response.json();
      setForumAdministrators(data.data || []);
    } catch (err: any) {
      console.error('Error fetching forum administrators:', err);
      setForumAdministrators([]);
    } finally {
      setIsLoadingForum(false);
    }
  };

  const handleAddAdministrator = async (userId: string) => {
    if (!forum?.forum_id) {
      setError('No se ha seleccionado un foro');
      return;
    }

    try {
      setError('');

      const response = await fetch(`${API_BASE}/forums/${forum.forum_id}/administrators`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar administrador');
      }

      // Actualizar ambas listas para reflejar los cambios
      await Promise.all([
        fetchForumAdministrators(),
        fetchAdministrators()
      ]);

      console.log('Administrador agregado exitosamente');
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding administrator:', err);
    }
  };

  const handleRemoveAdministrator = async (userId: string) => {
    // Por ahora solo mostramos un mensaje, ya que necesitaríamos
    // un endpoint específico para remover rol de admin
    setError('Funcionalidad de remover administradores aún no implementada');
    console.log('Remover administrador:', userId);
  };

  const handleRemoveForumAdministrator = async (userId: string) => {
    if (!forum?.forum_id) return;

    try {
      setError('');

      const response = await fetch(`${API_BASE}/forums/${forum.forum_id}/administrators/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al remover administrador del foro');
      }

      // Actualizar ambas listas para reflejar los cambios
      await Promise.all([
        fetchForumAdministrators(),
        fetchAdministrators()
      ]);

      console.log('Administrador removido exitosamente');
    } catch (err: any) {
      setError(err.message);
      console.error('Error removing forum administrator:', err);
    }
  };

  if (!isOpen) return null;

  // Filter administrators based on search and exclude those already in the forum
  const filteredAdministrators = administrators.filter(admin => {
    // First filter by search terms
    const matchesSearch = admin.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${admin.name} ${admin.parent_last_name}`.toLowerCase().includes(searchTerm.toLowerCase());

    // Then exclude administrators who are already in the forum
    const isNotInForum = !forumAdministrators.some(forumAdmin =>
      forumAdmin.user_id === admin.user_id
    );

    return matchesSearch && isNotInForum;
  });

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
      onClick={onClose}
    >
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
        <div className="w-8"></div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Forum Administrators Section */}
        {forum && (
          <div className="mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">
                Administradores de "{forum.name}"
              </h3>

              {isLoadingForum ? (
                <div className="text-center py-2">
                  <p className="text-gray-600 text-sm">Cargando administradores del foro...</p>
                </div>
              ) : forumAdministrators.length === 0 ? (
                <div className="text-center py-2">
                  <p className="text-gray-600 text-sm">Este foro no tiene administradores asignados</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {forumAdministrators.map((admin) => (
                    <div key={admin.user_id} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                      <div className="flex items-center space-x-2">
                        {/* Avatar placeholder */}
                        <div className="w-6 h-6 bg-blue-300 rounded-full flex items-center justify-center">
                          <span className="text-xs font-semibold text-blue-800">
                            {admin.name.charAt(0).toUpperCase()}{admin.parent_last_name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{admin.username}</p>
                          <p className="text-xs text-gray-500">
                            {admin.name} {admin.parent_last_name}
                          </p>
                        </div>
                      </div>

                      {/* Remove Forum Admin button */}
                      <button
                        onClick={() => handleRemoveForumAdministrator(admin.user_id)}
                        className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                        title="Quitar de este foro"
                      >
                        Quitar Admin
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

          {/* Add Administrator Button - Only show when not searching */}
          {showAddSection && searchTerm.trim() && filteredAdministrators.length === 0 && (
            <div className="mt-2">
              <button
                onClick={() => {
                  // Buscar usuario por username en la lista de administradores (incluyendo los ya asignados)
                  const userToAdd = administrators.find(admin =>
                    admin.username.toLowerCase() === searchTerm.toLowerCase()
                  );

                  if (userToAdd) {
                    // Verificar si ya está en el foro
                    const isAlreadyInForum = forumAdministrators.some(forumAdmin =>
                      forumAdmin.user_id === userToAdd.user_id
                    );

                    if (isAlreadyInForum) {
                      setError(`El usuario "${searchTerm}" ya es administrador de este foro`);
                    } else {
                      handleAddAdministrator(userToAdd.user_id);
                    }
                  } else {
                    setError(`Usuario "${searchTerm}" no encontrado en la lista de administradores`);
                  }
                }}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                Agregar "{searchTerm}" como administrador del foro
              </button>
            </div>
          )}
        </div>

        {/* Current Administrators Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-700">
              Administradores Disponibles ({filteredAdministrators.length} de {totalRecords})
            </h3>
            {totalPages > 1 && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span className="text-xs text-gray-500">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1 hover:bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-600 text-sm">Cargando administradores...</p>
            </div>
          ) : filteredAdministrators.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600 text-sm">
                {searchTerm
                  ? 'No se encontraron administradores que coincidan con la búsqueda'
                  : 'Todos los administradores ya están asignados a este foro'}
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredAdministrators.map((admin) => (
                <div key={admin.user_id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3">
                  <div className="flex items-center space-x-3">
                    {/* Avatar placeholder */}
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-gray-600">
                        {admin.name.charAt(0).toUpperCase()}{admin.parent_last_name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{admin.username}</p>
                      <p className="text-xs text-gray-500">
                        {admin.name} {admin.parent_last_name}
                      </p>
                      <p className="text-xs text-blue-500">{admin.role.role_name}</p>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center space-x-2">
                    {/* Make Admin button */}
                    <button
                      onClick={() => handleAddAdministrator(admin.user_id)}
                      className="px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
                      title="Hacer administrador de este foro"
                    >
                      Admin
                    </button>

                    {/* Message button */}
                    <button
                      onClick={() => {/* TODO: Send message */ }}
                      className="p-1 hover:bg-gray-100 rounded transition-colors"
                      title="Enviar mensaje"
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
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
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
        {/* Action Buttons */}
        <div className="flex gap-4 justify-center mt-6">
          <button
            onClick={() => {
              setError("");
              onClose();
            }}
            className="px-6 py-2 bg-white text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
          >
            Cancelar
          </button>
          <button
            onClick={() => {
              setError("");
              onClose();
            }}
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            Actualizar
          </button>
        </div>

      </div>
    </div>
  );
};
