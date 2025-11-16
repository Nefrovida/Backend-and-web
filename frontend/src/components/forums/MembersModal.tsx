import { useState, useEffect } from 'react';
import { Forum } from '../../types/forum.types';

interface Member {
  member_id: number;
  user_id: number;
  username: string;
  email: string;
  joined_date: string;
  status: 'active' | 'inactive';
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
 * Modal for managing forum members.
 * Shows current members and allows adding/removing them.
 * Placeholder implementation for future development.
 */
export const MembersModal: React.FC<MembersModalProps> = ({
  isOpen,
  onClose,
  onBack,
  forum,
  externalError,
}) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  // Update local error when external error changes
  useEffect(() => {
    if (externalError) {
      setError(externalError);
    }
  }, [externalError]);

  // Fetch members when modal opens
  useEffect(() => {
    if (isOpen && forum) {
      fetchMembers();
    }
  }, [isOpen, forum]);

  const fetchMembers = async () => {
    if (!forum) return;

    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/forums/${forum.forum_id}/members`, {
      //   credentials: 'include',
      // });

      // Placeholder data
      setTimeout(() => {
        setMembers([
          {
            member_id: 1,
            user_id: 1,
            username: 'usuario1',
            email: 'usuario1@example.com',
            joined_date: '2024-01-15',
            status: 'active',
          },
          {
            member_id: 2,
            user_id: 2,
            username: 'usuario2',
            email: 'usuario2@example.com',
            joined_date: '2024-02-01',
            status: 'active',
          },
        ]);
        setIsLoading(false);
      }, 500);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching members:', err);
      setIsLoading(false);
    }
  };

  if (!isOpen || !forum) return null;

  // Filter members based on search
  const filteredMembers = members.filter(member =>
    member.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase())
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
            Miembros
          </h2>
          <div className="w-8"> {/* Spacer for centering */}</div>
        </div>

        {/* Coming Soon Notice */}
        <div className="mb-6 p-4 bg-blue-100 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-blue-600 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <p className="text-blue-800 text-sm font-medium">
              Funcionalidad en desarrollo
            </p>
          </div>
          <p className="text-blue-700 text-sm mt-1">
            La gestión de miembros estará disponible próximamente.
          </p>
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
              placeholder="Buscar miembros..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={true} // Disabled for now
              className="w-full px-4 py-3 pl-10 bg-gray-100 rounded-lg border border-gray-200 cursor-not-allowed"
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

        {/* Members Section */}
        <div className="mb-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">
            Miembros del foro ({members.length})
          </h3>
          
          {isLoading ? (
            <div className="text-center py-4">
              <p className="text-gray-600 text-sm">Cargando miembros...</p>
            </div>
          ) : filteredMembers.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-gray-600 text-sm">No hay miembros en este foro</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredMembers.map((member) => (
                <div key={member.member_id} className="flex items-center justify-between bg-white rounded-lg px-4 py-3 opacity-50">
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
                      <p className="text-sm font-medium text-gray-900">{member.username}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  
                  {/* Status indicator */}
                  <div className="flex items-center">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      member.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {member.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
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
