import React, { useState } from 'react'
import NewNoteButton from '../atoms/notes/NewNoteButton'
import Title from '../atoms/Title'
import NewNoteModal from '../molecules/notes/NewNoteModal'
import CancelNoteButton from '../atoms/notes/CancelNoteButton'
import SaveNoteButton from '../atoms/notes/SaveNoteButton'
import Note from '@/types/note'

function Notas() {
  
  const [showModal, setShowModal] = useState(false)
  const [noteInfo, setNoteInfo] = useState<Note>({
    general: null,
    illness: null,
    recepie: null
  })

  function save() {
    if (noteInfo) {
      fetch("/api/notes", {
        method: "POST",
        body: JSON.stringify(noteInfo),
        credentials: "include"
      })
      setShowModal(false)
    }
  }

  return (
    <div className='w-1/2'>
      <div className='flex p-2 justify-between '>
        <Title>Notas</Title>
        {
          showModal 
          ? (<div className='flex gap-2'>
            <CancelNoteButton closeModal={() => setShowModal(false)}/>
            <SaveNoteButton save={() => save()}/>
          </div>)
          : (<NewNoteButton openModal={() => setShowModal(true)} />)
        }
        
      </div>
      {showModal && <NewNoteModal modalState={setNoteInfo}/>}
    </div>
  )
}

export default Notas