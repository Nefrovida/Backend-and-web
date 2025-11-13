import Subtitle from '@/components/atoms/Subtitle'
import TextArea from '@/components/atoms/TextArea'
import React from 'react'

function NewNoteModal() {
  return (
    <div className='bg-white rounded-md drop-shadow-md p-3'>
      <Subtitle text='Notas generales'/>
      <TextArea className='h-44'/>
      <Subtitle text='Padecimientos'/>
      <TextArea className='h-44'/>
      <Subtitle text='Receta'/>
      <TextArea className='h-44'/>
    </div>
  )
}

export default NewNoteModal