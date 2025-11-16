import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import usePostNotes from '@/hooks/notes/usePostNotes';
import TextArea from '../atoms/TextArea';
import Title from '../atoms/Title';

const MAX_TITLE_LENGTH = 50;
const MAX_GENERAL_NOTES_LENGTH = 1000;
const MAX_AILMENTS_LENGTH = 1000;
const MAX_PRESCRIPTION_LENGTH = 2000;

function CreateNotePage() {
  const { patientId } = useParams<{ patientId: string }>();
  const navigate = useNavigate();
  const { postNote, isLoading, error } = usePostNotes();

  const [title, setTitle] = useState('');
  const [generalNotes, setGeneralNotes] = useState('');
  const [ailments, setAilments] = useState('');
  const [prescription, setPrescription] = useState('');
  const [visibility, setVisibility] = useState(true);
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (!patientId) {
      setValidationError('ID de paciente inválido');
      return;
    }

    if (!title.trim()) {
      setValidationError('El título es requerido');
      return;
    }

    if (title.length > MAX_TITLE_LENGTH) {
      setValidationError(`El título no puede exceder ${MAX_TITLE_LENGTH} caracteres`);
      return;
    }

    if (generalNotes.length > MAX_GENERAL_NOTES_LENGTH) {
      setValidationError(`Las notas generales no pueden exceder ${MAX_GENERAL_NOTES_LENGTH} caracteres`);
      return;
    }

    if (ailments.length > MAX_AILMENTS_LENGTH) {
      setValidationError(`Los padecimientos no pueden exceder ${MAX_AILMENTS_LENGTH} caracteres`);
      return;
    }

    if (prescription.length > MAX_PRESCRIPTION_LENGTH) {
      setValidationError(`La receta no puede exceder ${MAX_PRESCRIPTION_LENGTH} caracteres`);
      return;
    }

    try {
      await postNote({
        patientId,
        title: title.trim(),
        general_notes: generalNotes || undefined,
        ailments: ailments || undefined,
        prescription: prescription || undefined,
        visibility,
      });

      navigate('/notas');
    } catch (err) {
      setValidationError('Error al guardar la nota');
    }
  };

  return (
    <div className='w-full min-h-screen p-4'>
      <div className='max-w-3xl mx-auto'>
        <div className='mb-6'>
          <Title>Nueva Nota de Consulta</Title>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-5'>
            <div>
              <label htmlFor='title' className='block text-sm font-medium text-gray-700 mb-2'>
                Título <span className='text-red-500'>*</span>
              </label>
              <input
                id='title'
                type='text'
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500'
                placeholder='Título de la nota'
                maxLength={MAX_TITLE_LENGTH}
                disabled={isLoading}
              />
              <div className='text-right text-xs text-gray-500 mt-1'>
                {title.length} / {MAX_TITLE_LENGTH}
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-5 space-y-4'>
            <div>
              <label htmlFor='general-notes' className='block text-sm font-medium text-gray-700 mb-2'>
                Notas Generales
              </label>
              <TextArea
                className='min-h-[120px] resize-none'
                onChange={setGeneralNotes}
                maxLength={MAX_GENERAL_NOTES_LENGTH}
                value={generalNotes}
              />
            </div>

            <div>
              <label htmlFor='ailments' className='block text-sm font-medium text-gray-700 mb-2'>
                Padecimientos
              </label>
              <TextArea
                className='min-h-[120px] resize-none'
                onChange={setAilments}
                maxLength={MAX_AILMENTS_LENGTH}
                value={ailments}
              />
            </div>

            <div>
              <label htmlFor='prescription' className='block text-sm font-medium text-gray-700 mb-2'>
                Receta
              </label>
              <TextArea
                className='min-h-[120px] resize-none'
                onChange={setPrescription}
                maxLength={MAX_PRESCRIPTION_LENGTH}
                value={prescription}
              />
            </div>
          </div>

          <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-5'>
            <div className='flex items-center'>
              <input
                id='visibility'
                type='checkbox'
                checked={visibility}
                onChange={(e) => setVisibility(e.target.checked)}
                className='h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500'
                disabled={isLoading}
              />
              <label htmlFor='visibility' className='ml-2 block text-sm text-gray-700'>
                Visible para el paciente
              </label>
            </div>
          </div>

          {(validationError || error) && (
            <div className='p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm'>
              {validationError || error}
            </div>
          )}

          <div className='flex gap-3'>
            <button
              type='button'
              onClick={() => navigate('/notas')}
              className='flex-1 px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 disabled:opacity-50 transition-colors'
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type='submit'
              className='flex-1 px-6 py-2.5 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 disabled:opacity-50 transition-colors'
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : 'Guardar Nota'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateNotePage;