import React from 'react'
import NewNoteButton from '../atoms/notes/NewNoteButton'
import Title from '../atoms/Title'
import NewNoteModal from '../molecules/notes/NewNoteModal'
import CancelNoteButton from '../atoms/notes/CancelNoteButton'
import SaveNoteButton from '../atoms/notes/SaveNoteButton'
import usePostNotes from '@/hooks/notes/usePostNotes'

function Notas() {
  const {
    showModal, 
    patients, 
    setNoteInfo, 
    setSelectedPatient, 
    setShowModal, 
    save
  } = usePostNotes();

  return (
    <div className='w-1/2'>
      <div className='flex p-2 justify-between items-center'>
        <div className='flex gap-4'>
          <Title>Notas</Title>
          <select 
            name="patient" 
            id="patient"
            className="h-9 px-2 rounded border"
            onChange={(e) => setSelectedPatient(e.target.value)}
            defaultValue=""
            >
            <option value="" disabled>Elige un paciente...</option> 
            {patients.map((patient, idx) => {
              const patientName = patient.name + " " + patient.parentalLastName + " " + patient.maternalLastName;
              return (
                <option value={patient.userId} key={idx} className=''>
                  {patientName}
                </option>
              )})
            }
          </select>
        </div>
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