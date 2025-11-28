import React from 'react';
import { useParams } from 'react-router-dom';
import useGetNotes from '@/hooks/notes/useGetNotes';
import Title from '../atoms/Title';

function NotesListPage() {
  const { patientId } = useParams<{ patientId?: string }>();
  const { notes, loading, error } = useGetNotes({ patientId });

  const sortedNotes = notes.length > 0 ? [...notes].sort((a, b) => {
    const dateA = new Date(a.creation_date).getTime();
    const dateB = new Date(b.creation_date).getTime();
    return dateB - dateA;
  }) : [];

  return (
    <div className='w-full min-h-screen p-4'>
      <div className='max-w-3xl mx-auto'>
        <div className='mb-6'>
          <Title>Notas de Consulta</Title>
        </div>

        <div className='space-y-3'>
          {loading && (
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
              <p className='text-gray-600'>Cargando notas...</p>
            </div>
          )}

          {error && (
            <div className='bg-white rounded-lg shadow-sm border border-red-200 p-4'>
              <p className='text-red-600'>{error}</p>
            </div>
          )}

          {!loading && !error && notes.length === 0 && (
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center'>
              <p className='text-gray-600'>No hay notas registradas</p>
            </div>
          )}

          {!loading && !error && sortedNotes.length > 0 && (
            <div className='bg-white rounded-lg shadow-sm border border-gray-200'>
              <div className='p-4 border-b border-gray-200'>
                <h3 className='text-base font-semibold text-gray-900'>
                  Historial de notas ({sortedNotes.length})
                </h3>
              </div>
              <div className='max-h-[600px] overflow-y-auto p-4 space-y-3'>
                {sortedNotes.map((note) => (
                  <div
                    key={note.note_id}
                    className='bg-gray-50 rounded-lg border border-gray-200 p-4 hover:bg-gray-100 transition-colors'
                  >
                    <div className='flex justify-between items-start mb-3 pb-2 border-b border-gray-200'>
                      <h4 className='text-base font-semibold text-gray-900'>{note.title}</h4>
                      <span className='text-xs text-gray-500 whitespace-nowrap ml-4'>
                        {new Date(note.creation_date).toLocaleDateString('es-MX', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <div className='space-y-2'>
                      {note.general_notes && (
                        <div>
                          <h5 className='text-xs font-semibold text-gray-700 mb-1'>Notas Generales</h5>
                          <p className='text-sm text-gray-600 leading-relaxed whitespace-pre-wrap'>
                            {note.general_notes}
                          </p>
                        </div>
                      )}

                      {note.ailments && (
                        <div>
                          <h5 className='text-xs font-semibold text-gray-700 mb-1'>Padecimientos</h5>
                          <p className='text-sm text-gray-600 leading-relaxed whitespace-pre-wrap'>
                            {note.ailments}
                          </p>
                        </div>
                      )}

                      {note.prescription && (
                        <div>
                          <h5 className='text-xs font-semibold text-gray-700 mb-1'>Receta</h5>
                          <p className='text-sm text-gray-600 leading-relaxed whitespace-pre-wrap'>
                            {note.prescription}
                          </p>
                        </div>
                      )}
                    </div>

                    {!note.visibility && (
                      <div className='mt-2 pt-2 border-t border-gray-200'>
                        <span className='inline-flex items-center text-xs text-gray-500 italic'>
                          🔒 No visible para el paciente
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default NotesListPage;