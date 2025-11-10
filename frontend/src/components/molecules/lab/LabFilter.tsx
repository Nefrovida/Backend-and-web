import React, { FC, useEffect, useState } from 'react'
import analysisInfo from '../../../types/analysisInfo'

interface Props {
  onChange: (startDate: Date|null, endDate: Date|null, analysis: number[]) => void
}

const LabFilter: FC<Props> = ({onChange}) => {
  const [analysis, setAnalysis] = useState<analysisInfo[]>([])
  const [inputs, setInputs] = useState({})
  const [date, setDate] = useState<{start: Date|null, end: Date|null}>({start: null, end: null})
  
  function handleFilter() {
    const selected = (Object.values(inputs) as {selected: boolean, value: number}[])
      .filter((v) => v.selected)
      .map((v) => (v.value))
    onChange(date.start, date.end, selected)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;
    setInputs(values => ({...values, [name]: {selected: value, value: target.value}}))
  }
  
  useEffect(() => {
    fetch("/api/laboratory/analysis")
      .then(res => res.json())
      .then(data => setAnalysis(data))
      .catch(err => console.error(err))
  }, [])
  
  return (
    <div className='absolute top-[4.3rem] -translate-x-28 bg-white rounded-md h-96 w-80 z-10 drop-shadow-xl shadow-lg p-2'>
      <h2 className='text-lg'>Rango de fechas</h2>
      <div className='flex gap-2 w-fit flex-wrap my-1'>
        <span>De</span>
        <input type="date" className='bg-gray-200 text-sm' onChange={(e) => setDate(prev => ({...prev, start: new Date(e.target.value)}))}/>
        <span>al</span>
        <input type="date" className='bg-gray-200 text-sm' onChange={(e) => setDate(prev => ({...prev, end: new Date(e.target.value)}))}/>
      </div>
      <h2 className='mt-2 text-lg'>Tipo de examen</h2>
      <div className='flex flex-col overflow-scroll h-60 '>
        {analysis.map((a, idx) => (
          <label htmlFor={"analysis_"+a.analysis_id} className='flex gap-2 items-center' key={idx}>
            <input type="checkbox" id={"analysis_"+a.analysis_id}  name={a.name} value={a.analysis_id} onChange={(e) => handleChange(e)}/>
            {a.name}
          </label>
        ))}
      </div>
      <button className='bg-success hover:bg-hover-success rounded-md w-full  py-1' onClick={handleFilter}>
        Buscar
      </button>
    </div>
  )
}

export default LabFilter