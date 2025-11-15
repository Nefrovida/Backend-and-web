import React, { FC, useEffect, useState } from 'react'
import analysisInfo from '../../../types/analysisInfo'
import CreateAnalysisModal from '../../organism/lab/CreateAnalysisModal'
import { CreateAnalysisData } from '../../../types/add.analysis.types'
import { analysisService } from '../../../services/analysis.service'
import { FiTrash2 } from 'react-icons/fi'
import { GoVerified } from 'react-icons/go';
import { PiFlaskLight } from 'react-icons/pi';
import { FiAlertTriangle } from 'react-icons/fi';

interface Props {
  onChange: (
    startDate: Date|null, 
    endDate: Date|null, 
    analysis: number[], 
    status: {
      sent: boolean, 
      pending: boolean, 
      lab: boolean
    }) => void
}


const LabFilter: FC<Props> = ({onChange}) => {
  const [analysis, 
    setAnalysis] = useState<analysisInfo[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [inputs, setInputs] = useState({}) // Inputs
  const [date, setDate] = useState<{start: Date|null, end: Date|null}>({start: null, end: null})
  const [status, setStatus] = useState<{sent: boolean, pending: boolean, lab: boolean}>({sent: false, pending: false, lab: false})
  
  function handleFilter() {
    const selected = (Object.values(inputs) as {selected: boolean, value: number}[])
      .filter((v) => v.selected)
      .map((v) => (v.value))
    onChange(date.start, date.end, selected, status)
  }

  function deleteFilter() {
    onChange(null, null, [], {sent: false, pending: false, lab: false})
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setInputs(values => ({...values, [name]: {selected: value, value: target.value}}))
  }

  const handleChangeStatus = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setStatus(values => ({...values, [name]: value}))
  }
  
  useEffect(() => {
    fetch("/api/laboratory/analysis", {
      credentials: "include" // Include cookies in request
    })
      .then(res => res.json())
      .then(data => setAnalysis(data))
      .catch(err => console.error(err))
  }, [])
  
  return (
    <>
    <div className='absolute top-[4.3rem] -translate-x-28 bg-white rounded-md h-96 w-80 z-10 drop-shadow-xl shadow-lg p-2'>
      <div className='flex justify-between items-center mb-2'>
        <h1 className='text-lg font-semibold'>Filtro</h1>
        <div className='flex gap-2'>
          <button onClick={() => setIsModalOpen(true)} className='bg-blue-500 text-white px-3 py-1 rounded-md'>Crear</button>
        </div>
      </div>
      <h2 className='text-lg'>Rango de fechas</h2>
      <div className='flex gap-2 w-fit flex-wrap my-1'>
        <span>De</span>
        <input type="date" className='bg-gray-200 text-sm' onChange={(e) => setDate(prev => ({...prev, start: new Date(e.target.value)}))}/>
        <span>al</span>
        <input type="date" className='bg-gray-200 text-sm' onChange={(e) => setDate(prev => ({...prev, end: new Date(e.target.value)}))}/>
      </div>
      <h2 className='mt-2 text-lg'>Estatus</h2>
      <div>
        <label htmlFor="sent" className="flex gap-1 items-center">
          <input className='flex items-center hover:underline' 
            onChange={(e) => {handleChangeStatus(e)}}
            type='checkbox'
            name={"sent"} 
            value={"sent"}
            id="sent"
            />
          <GoVerified className="text-green-600" />
          Enviado
        </label>
        
        <label htmlFor="pending" className="flex gap-1 items-center">
          <input className='flex items-center hover:underline'
            onChange={(e) => {handleChangeStatus(e)}}
              type='checkbox'
              name={"pending"}
              value={"pending"}
              id="pending"
              />
          <FiAlertTriangle className="text-yellow-400" />
          Pendiente
        </label>
        
        <label htmlFor="lab" className="flex gap-1 items-center">
          <input className='flex items-center hover:underline' 
            onChange={(e) => {handleChangeStatus(e)}}
            type='checkbox'
            name={"lab"} 
            value={"lab"}
            id="lab"
            />
          <PiFlaskLight className="text-red-600" />
          En laboratorio
        </label>
        
      </div>
      <h2 className='mt-2 text-lg'>Tipo de examen</h2>
      <div className='flex flex-col overflow-scroll h-32'>
        {analysis.map((a, idx) => (
          <label htmlFor={"analysis_"+a.analysis_id} className='flex gap-2 items-center justify-between' key={idx}>
            <div className='flex gap-2 items-center'>
              <input type="checkbox" id={"analysis_"+a.analysis_id}  name={a.name} value={a.analysis_id} onChange={(e) => handleChange(e)}/>
              {a.name}
            </div>
            <button title="Eliminar examen" className="text-red-500 hover:opacity-80" onClick={async (e) => {
              e.preventDefault();
              if (!confirm(`¿Eliminar examen ${a.name}?`)) return;

              try {
                await analysisService.deleteAnalysis(a.analysis_id);
                // Refetch analysis list
                const res = await fetch("/api/laboratory/analysis", {credentials: 'include'});
                const data = await res.json();
                setAnalysis(data);
                alert('Examen eliminado');
              } catch (err: any) {
                alert(err?.message || 'Error al eliminar examen');
              }
            }}>
              <FiTrash2 />
            </button>
          </label>
        ))}
      </div>
      <div className='flex gap-2'>
        <button className='bg-gray-300 hover:bg-gray-200 rounded-md w-1/2 py-1' onClick={deleteFilter}>
          Borrar
        </button>
        <button className='bg-success hover:bg-hover-success rounded-md w-1/2 py-1' onClick={handleFilter}>
          Buscar
        </button>
      </div>
  </div>
  <CreateAnalysisModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={async (data: CreateAnalysisData) => {
      try {
        await analysisService.createAnalysis(data);
        const res = await fetch("/api/laboratory/analysis", {credentials: 'include'});
        const newData = await res.json();
        setAnalysis(newData);
        setIsModalOpen(false);
        alert('Examen creado');
      } catch (err: any) {
        alert(err?.message || 'Error creando examen');
      }
    }} externalError={""} />
    </>
  )
}

export default LabFilter