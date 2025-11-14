import { useState, useEffect } from 'react';
import { Forum, CreateForumData } from '../../types/forum.types';
import { ForumItem } from '../../components/forums/ForumItem';
import { CreateForumModal } from '../../components/forums/CreateForumModal';

/**
 * ForumsPage Component
 * 
 * Main page for the Forums module.
 * 
 * Features:
 * - Displays list of forums
 * - Search and filter functionality
 * - Create new forum button
 * - Modal for creating forums with visibility selection
 * - Integrates with backend API at /api/forums
 * 
 * Based on Figma design with existing project patterns.
 */
export const ForumsPage = () => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch forums on component mount
  useEffect(() => {
    fetchForums();
  }, []);

  const fetchForums = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/forums', {
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
      const response = await fetch('/api/forums', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el foro');
      }

      const newForum = await response.json();
      setForums([newForum, ...forums]);
      setIsModalOpen(false);
      alert('Foro creado exitosamente');
    } catch (err: any) {
      alert(err.message);
      console.error('Error creating forum:', err);
    }
  };

  const handleSettingsClick = (forum: Forum) => {
    console.log('Settings clicked for forum:', forum);
    // TODO: Implement settings functionality
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
          <div className="space-y-0">
            {filteredForums.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow-sm">
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
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleCreateForum}
      />
    </div>
  );
};

export default ForumsPage;
