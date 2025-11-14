import Subtitle from '@/components/atoms/Subtitle'
import TextArea from '@/components/atoms/TextArea'
import Note from '@/types/note'
import React, { FC } from 'react'

interface Props {
  modalState: React.Dispatch<React.SetStateAction<Note>>
}

const NewNoteModal: FC<Props> = ({modalState})  =>{
  function handleChange(type: string, v: string) {
    modalState(prev => ({
      ...prev,
      [type]: v
    }))
  }
  
  return (
    <div className='bg-white rounded-md drop-shadow-md p-3'>
      <Subtitle text='Notas generales'/>
      <TextArea className='h-44' onChange={(v: string) => handleChange("general", v)}/>
      <Subtitle text='Padecimientos'/>
      <TextArea className='h-44' onChange={(v: string) => handleChange("illness", v)}/>
      <Subtitle text='Receta'/>
      <TextArea className='h-44' onChange={(v: string) => handleChange("recepie", v)}/>
    </div>
  )
}

export default NewNoteModal