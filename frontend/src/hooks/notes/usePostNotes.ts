import Note from "@/types/note"
import patient from "@/types/patient"
import { useEffect, useState } from "react"

function usePostNotes() {
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

  return {
    showModal,
    patients,
    setNoteInfo,
    setShowModal,
    setSelectedPatient,
    save
  }
}  

export default usePostNotes;