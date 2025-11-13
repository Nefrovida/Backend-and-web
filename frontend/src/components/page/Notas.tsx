import React, { useState } from 'react'
import NewNoteButton from '../atoms/notes/NewNoteButton'
import Title from '../atoms/Title'
import NewNoteModal from '../molecules/notes/NewNoteModal'
import CancelNoteButton from '../atoms/notes/CancelNoteButton'
import SaveNoteButton from '../atoms/notes/SaveNoteButton'

function Notas() {
  
  const [showModal, setShowModal] = useState(false)

  function save() {
    
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
      {showModal && <NewNoteModal />}
    </div>
  )
}

export default Notas