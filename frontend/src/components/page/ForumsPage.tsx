import { useState, useEffect } from 'react';
import { Forum, CreateForumData } from '../../types/forum.types';
import { ForumItem } from '../../components/forums/ForumItem';
import { CreateForumModal } from '../../components/forums/CreateForumModal';
import { UpdateForumModal } from '../../components/forums/UpdateForumModal';
import { ForumConfigModal } from '../../components/forums/ForumConfigModal';
import { AdministratorsModal } from '../../components/forums/AdministratorsModal';
import { MembersModal } from '../../components/forums/MembersModal';
import { DeleteForumModal } from '../../components/forums/DeleteForumModal';

const API_BASE = (import.meta as any).env?.VITE_APP_API_URL || 'http://localhost:3001/api';


/**
 * ForumsPage Component
 * 
 * Main page for the Forums module.
 * 
 * Features:
 * - Displays list of forums
 * - Search and filter functionality
 * - Create new forum button
 * - Comprehensive forum management through configuration modal:
 *   - Visibility settings (public/private)
 *   - Administrator management
 *   - Member management (placeholder)
 *   - Forum deletion with confirmation
 * - Modal system for all forum operations
 * - Integrates with backend API at /api/forums
 * 
 * Based on mobile interface design adapted for web with consistent styling.
 */
export const ForumsPage = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalError, setModalError] = useState<string>('');
  const [selectedForum, setSelectedForum] = useState<Forum | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isAdministratorsModalOpen, setIsAdministratorsModalOpen] = useState(false);
  const [isMembersModalOpen, setIsMembersModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Fetch forums on component mount
  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE}/forums`, {
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al cargar los foros');
      }

      const data = await response.json();
      setForums(data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching forums:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateForum = async (data: CreateForumData) => {
    try {
      setModalError(''); // Clear previous modal errors
      
      const response = await fetch(`${API_BASE}/forums`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle validation errors from Zod
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const firstError = errorData.errors[0];
          setModalError(firstError.message);
          return; // Don't close modal, show error
        }
        
        // Handle other errors
        setModalError(errorData.error || 'Error al crear el foro');
        return; // Don't close modal, show error
      }

      const newForum = await response.json();
      setForums([newForum, ...forums]);
      setIsModalOpen(false);
      setModalError(''); // Clear error on success
      alert('Foro creado exitosamente');
    } catch (err: any) {
      setModalError(err.message || 'Error al crear el foro');
      console.error('Error creating forum:', err);
    }
  };

  const handleUpdateForum = async (forumId: number, publicStatus: boolean) => {
    try {
      setModalError(''); // Clear previous modal errors
      
      const response = await fetch(`${API_BASE}/forums/${forumId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_status: publicStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle validation errors from Zod
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const firstError = errorData.errors[0];
          setModalError(firstError.message);
          return; // Don't close modal, show error
        }
        
        // Handle other errors
        setModalError(errorData.error || 'Error al actualizar el foro');
        return; // Don't close modal, show error
      }

      const updatedForum = await response.json();
      setForums(forums.map(forum => 
        forum.forum_id === forumId ? updatedForum : forum
      ));
      setIsUpdateModalOpen(false);
      setSelectedForum(null);
      setModalError(''); // Clear error on success
      alert('Visibilidad del foro actualizada exitosamente');
    } catch (err: any) {
      setModalError(err.message || 'Error al actualizar el foro');
      console.error('Error updating forum:', err);
    }
  };

  const handleSettingsClick = (forum: Forum) => {
    setSelectedForum(forum);
    setIsConfigModalOpen(true);
  };

  const handleVisibilityClick = (forum: Forum) => {
    setSelectedForum(forum);
    setIsUpdateModalOpen(true);
  };

  const handleMembersClick = (forum: Forum) => {
    setSelectedForum(forum);
    setIsMembersModalOpen(true);
  };

  const handleAdministratorsClick = (forum: Forum) => {
    setSelectedForum(forum);
    setIsAdministratorsModalOpen(true);
  };

  const handleDeleteForumClick = (forum: Forum) => {
    setSelectedForum(forum);
    setIsDeleteModalOpen(true);
  };

  // Functions to go back to config modal
  const handleBackToConfig = () => {
    setIsUpdateModalOpen(false);
    setIsAdministratorsModalOpen(false);
    setIsMembersModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsConfigModalOpen(true);
  };

  const handleDeleteForum = async (forumId: number) => {
    try {
      setModalError(''); // Clear previous modal errors
      
      const response = await fetch(`${API_BASE}/forums/${forumId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle validation errors from Zod
        if (errorData.errors && Array.isArray(errorData.errors)) {
          const firstError = errorData.errors[0];
          setModalError(firstError.message);
          return; // Don't close modal, show error
        }
        
        // Handle other errors
        setModalError(errorData.error || 'Error al eliminar el foro');
        return; // Don't close modal, show error
      }

      // Remove forum from list
      setForums(forums.filter(forum => forum.forum_id !== forumId));
      setIsDeleteModalOpen(false);
      setSelectedForum(null);
      setModalError(''); // Clear error on success
      alert('Foro eliminado exitosamente');
    } catch (err: any) {
      setModalError(err.message || 'Error al eliminar el foro');
      console.error('Error deleting forum:', err);
    }
  };

  // Filter forums based on search term
  const filteredForums = forums.filter((forum) =>
    forum.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Foros</h1>
          <p className="text-gray-600">Participa en las discusiones de la comunidad</p>
        </div>

        {/* Search and Create Section */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          {/* Search Input */}
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Buscar foro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent"
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

          {/* Create Forum Button */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-lg hover:bg-blue-600 transition-colors shadow-sm whitespace-nowrap"
          >
            + Crear Foro
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-600">Cargando foros...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-600">{error}</p>
            <button
              onClick={fetchForums}
              className="mt-2 text-sm text-red-700 underline hover:text-red-800"
            >
              Intentar nuevamente
            </button>
          </div>
        )}

        {/* Forums List */}
        {!isLoading && !error && (
          <div>
            {filteredForums.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-gray-600">
                  {searchTerm ? 'No se encontraron foros' : 'No hay foros disponibles'}
                </p>
              </div>
            ) : (
              filteredForums.map((forum) => (
                <ForumItem
                  key={forum.forum_id}
                  forum={forum}
                  onSettingsClick={handleSettingsClick}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* Create Forum Modal */}
      <CreateForumModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setModalError(''); // Clear error when closing
        }}
        onConfirm={handleCreateForum}
        externalError={modalError}
      />

      {/* Update Forum Modal */}
      <UpdateForumModal
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setSelectedForum(null);
          setModalError(''); // Clear error when closing
        }}
        onBack={handleBackToConfig}
        onConfirm={handleUpdateForum}
        forum={selectedForum}
        externalError={modalError}
      />

      {/* Forum Configuration Modal */}
      <ForumConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => {
          setIsConfigModalOpen(false);
          setSelectedForum(null);
          setModalError(''); // Clear error when closing
        }}
        forum={selectedForum}
        onVisibilityClick={handleVisibilityClick}
        onMembersClick={handleMembersClick}
        onAdministratorsClick={handleAdministratorsClick}
        onDeleteClick={handleDeleteForumClick}
      />

      {/* Administrators Modal */}
      <AdministratorsModal
        isOpen={isAdministratorsModalOpen}
        onClose={() => {
          setIsAdministratorsModalOpen(false);
          setSelectedForum(null);
          setModalError(''); // Clear error when closing
        }}
        onBack={handleBackToConfig}
        forum={selectedForum}
        externalError={modalError}
      />

      {/* Members Modal */}
      <MembersModal
        isOpen={isMembersModalOpen}
        onClose={() => {
          setIsMembersModalOpen(false);
          setSelectedForum(null);
          setModalError(''); // Clear error when closing
        }}
        onBack={handleBackToConfig}
        forum={selectedForum}
        externalError={modalError}
      />

      {/* Delete Forum Modal */}
      <DeleteForumModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedForum(null);
          setModalError(''); // Clear error when closing
        }}
        onBack={handleBackToConfig}
        onConfirm={handleDeleteForum}
        forum={selectedForum}
        externalError={modalError}
      />
    </div>
  );
};

export default ForumsPage;
