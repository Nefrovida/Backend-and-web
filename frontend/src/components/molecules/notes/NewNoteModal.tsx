import Subtitle from '@/components/atoms/Subtitle';
import TextArea from '@/components/atoms/TextArea';
import React, { FC } from 'react';

const MAX_GENERAL_NOTES_LENGTH = 1000;
const MAX_AILMENTS_LENGTH = 1000;
const MAX_PRESCRIPTION_LENGTH = 2000;

interface Props {
  modalState: React.Dispatch<React.SetStateAction<{
    general_notes: string;
    ailments: string;
    prescription: string;
  }>>
}

const NewNoteModal: FC<Props> = ({ modalState }) => {
  const [values, setValues] = React.useState({
    general_notes: '',
    ailments: '',
    prescription: ''
  });

  function handleChange(type: 'general_notes' | 'ailments' | 'prescription', v: string) {
    setValues(prev => ({
      ...prev,
      [type]: v
    }));
    modalState(prev => ({
      ...prev,
      [type]: v
    }));
  }
  
  return (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Notas generales
        </label>
        <TextArea
          className='min-h-[120px] resize-none'
          onChange={(v: string) => handleChange("general_notes", v)}
          maxLength={MAX_GENERAL_NOTES_LENGTH}
          value={values.general_notes}
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Padecimientos
        </label>
        <TextArea
          className='min-h-[120px] resize-none'
          onChange={(v: string) => handleChange("ailments", v)}
          maxLength={MAX_AILMENTS_LENGTH}
          value={values.ailments}
        />
      </div>

      <div>
        <label className='block text-sm font-medium text-gray-700 mb-2'>
          Receta
        </label>
        <TextArea
          className='min-h-[120px] resize-none'
          onChange={(v: string) => handleChange("prescription", v)}
          maxLength={MAX_PRESCRIPTION_LENGTH}
          value={values.prescription}
        />
      </div>
    </div>
  );
}

export default NewNoteModal;