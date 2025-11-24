import { useState, useEffect } from 'react';
import { Forum } from '../../types/forum.types';

interface User {
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

interface ForumMember {
  user_id: string;
  name: string;
  parent_last_name: string;
  maternal_last_name: string;
  username: string;
  phone_number: string;
  registration_date: string;
  forum_role: string;
  role?: {
    role_name: string;
  };
}

interface MembersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void; // Optional back button to return to config modal
  forum: Forum | null;
  externalError?: string;
}

/**
 * MembersModal Component
 * 
 * Modal for managing forum members (non-admin users).
 * Shows current members and allows adding new ones.
 */
export const MembersModal: React.FC<MembersModalProps> = ({
  isOpen,
  onClose,
  onBack,
  forum,
  externalError,
}) => {
  const [users, setUsers] = useState<User[]>([]);
  const [forumMembers, setForumMembers] = useState<ForumMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingForum, setIsLoadingForum] = useState(false);
  const [error, setError] = useState<string>('');
  const [showAddSection, setShowAddSection] = useState(true); // Mostrar "Agregar Miembros" por defecto
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  // Prefer using a configured API base URL; fallback to the backend default
  const API_BASE = (import.meta as any).env?.VITE_APP_API_URL || 'http://localhost:3001/api';

  // Update local error when external error changes
  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  // Fetch users when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchUsers();
      if (forum?.forum_id) {
        fetchForumMembers();
      }
    }
  }, [isOpen, currentPage, forum?.forum_id]);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await fetch(`${API_BASE}/forums/regular-users?page=${currentPage}&limit=10`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al cargar los usuarios');
      }

      const data = await response.json();
      setUsers(data.data || []);
      setTotalPages(data.pagination?.totalPages || 1);
      setTotalRecords(data.pagination?.totalRecords || 0);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching users:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchForumMembers = async () => {
    if (!forum?.forum_id) return;

    try {
      setIsLoadingForum(true);
      setError('');

      const response = await fetch(`${API_BASE}/forums/${forum.forum_id}/members`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al cargar los miembros del foro');
      }

      const data = await response.json();
      setForumMembers(data.data || []);
    } catch (err: any) {
      console.error('Error fetching forum members:', err);
      setForumMembers([]);
    } finally {
      setIsLoadingForum(false);
    }
  };

  const handleAddMember = async (userId: string) => {
    if (!forum?.forum_id) {
      setError('No se ha seleccionado un foro');
      return;
    }

    try {
      setError('');

      const response = await fetch(`${API_BASE}/forums/${forum.forum_id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ user_id: userId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar miembro');
      }

      // Actualizar ambas listas para reflejar los cambios
      await Promise.all([
        fetchForumMembers(),
        fetchUsers()
      ]);

      console.log('Miembro agregado exitosamente');
    } catch (err: any) {
      setError(err.message);
      console.error('Error adding member:', err);
    }
  };

  const handleRemoveForumMember = async (userId: string) => {
    if (!forum?.forum_id) return;

    try {
      setError('');

      const response = await fetch(`${API_BASE}/forums/${forum.forum_id}/members/${userId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al remover miembro del foro');
      }

      // Actualizar ambas listas para reflejar los cambios
      await Promise.all([
        fetchForumMembers(),
        fetchUsers()
      ]);

      console.log('Miembro removido exitosamente');
    } catch (err: any) {
      setError(err.message);
      console.error('Error removing forum member:', err);
    }
  };

  if (!isOpen) return null;

  // Filter users based on search and exclude those already in the forum
  const filteredUsers = users.filter(user => {
    // First filter by search terms
    const matchesSearch = user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${user.name} ${user.parent_last_name}`.toLowerCase().includes(searchTerm.toLowerCase());

    // Then exclude users who are already in the forum
    const isNotInForum = !forumMembers.some(forumMember =>
      forumMember.user_id === user.user_id
    );

    return matchesSearch && isNotInForum;
  });

  // Filter forum members based on search
  const filteredForumMembers = forumMembers.filter(member =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    `${member.name} ${member.parent_last_name}`.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60]"
      onClick={onClose}
    >
      <div
        className="bg-[#CFE6ED] rounded-3xl shadow-2xl p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto"
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
            Gestionar Miembros
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

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Search Section */}
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar miembros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 bg-white rounded-lg border border-gray-200 focus:outline-none focus:border-blue-500"
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
        </div>

        {/* Tabs */}
        <div className="flex mb-4 bg-white rounded-lg p-1">
          <button
            onClick={() => setShowAddSection(true)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${showAddSection
                ? 'bg-green-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Agregar Miembros
          </button>
          <button
            onClick={() => setShowAddSection(false)}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${!showAddSection
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:text-gray-900'
              }`}
          >
            Miembros Actuales ({forumMembers.length})
          </button>
        </div>

        {/* Content */}
        {showAddSection ? (
          /* Add Members Section */
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">
                Agregar nuevos miembros
              </h3>
              <p className="text-xs text-gray-500">
                {totalRecords} usuarios disponibles
              </p>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                <p className="text-gray-600 text-sm mt-2">Cargando usuarios...</p>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                  />
                </svg>
                <p className="text-gray-600 text-sm">No hay usuarios disponibles para agregar</p>
              </div>
            ) : (
              <>
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {filteredUsers.map((user) => (
                    <div key={user.user_id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.username}</p>
                          <p className="text-xs text-gray-500">
                            {`${user.name} ${user.parent_last_name}`}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs">
                          {user.role.role_name}
                        </span>
                        <button
                          onClick={() => handleAddMember(user.user_id)}
                          className="p-1 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                          title="Agregar al foro"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-4">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>

                    <span className="text-sm text-gray-600">
                      Página {currentPage} de {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          /* Current Members Section */
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-gray-700">
                Miembros del foro
              </h3>
            </div>

            {isLoadingForum ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                <p className="text-gray-600 text-sm mt-2">Cargando miembros...</p>
              </div>
            ) : filteredForumMembers.length === 0 ? (
              <div className="text-center py-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-gray-400 mx-auto mb-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="text-gray-600 text-sm">No hay miembros en este foro</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-80 overflow-y-auto">
                {filteredForumMembers.map((member) => (
                  <div key={member.user_id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {member.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{member.username}</p>
                        <p className="text-xs text-gray-500">
                          {`${member.name} ${member.parent_last_name}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                        {member.forum_role === 'MEMBER' || member.forum_role === 'VIEWER'
                          ? member.role?.role_name || member.forum_role
                          : member.forum_role}
                      </span>
                      <button
                        onClick={() => handleRemoveForumMember(member.user_id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded-full transition-colors"
                        title="Remover del foro"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
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
        )}

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            {forum ? `Foro: ${forum.name}` : 'Sin foro seleccionado'} • {' '}
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
