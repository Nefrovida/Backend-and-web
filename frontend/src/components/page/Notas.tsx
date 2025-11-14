import React, { useEffect, useState } from 'react'
import NewNoteButton from '../atoms/notes/NewNoteButton'
import Title from '../atoms/Title'
import NewNoteModal from '../molecules/notes/NewNoteModal'
import CancelNoteButton from '../atoms/notes/CancelNoteButton'
import SaveNoteButton from '../atoms/notes/SaveNoteButton'
import Note from '@/types/note'
import patient from '@/types/patient'

function Notas() {
  const [showModal, setShowModal] = useState(false)
  const [noteInfo, setNoteInfo] = useState<Note>({
    general: null,
    illness: null,
    recepie: null
  })
  const [patients, setPatients] = useState<patient[]>([])
  const [selectedPatient, setSelectedPatient] = useState<string>("")

  useEffect(() => {
    fetch("/api/patients/doctorPatients", {
      credentials: "include"
    })
    .then(async res => {
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.error || "Error desconocido")
      }

      return data;
    })
    .then(data => {
      const patientsInfo: patient[] = data.map(d => {
        const name = d.user.name
        const parentalLastName = d.user.parent_last_name
        const maternalLastName = d.user.maternal_last_name
        const userId = d.patient_id
        
        return { name, parentalLastName, maternalLastName, userId }
      })

      setPatients(patientsInfo);
    })
    .catch(error => console.error("Error: ", error))
  }, [])

  function save() {
    if (noteInfo && selectedPatient) {
      console.log(JSON.stringify({patientId: selectedPatient, noteInfo}))
      fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({patientId: selectedPatient, noteInfo}),
        credentials: "include"
      })
      .then((res) => console.log(res))
      .catch((e) => {
        console.error(e)
      })
      setShowModal(false)
    }
  }

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