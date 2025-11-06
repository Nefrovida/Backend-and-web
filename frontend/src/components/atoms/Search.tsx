import React, { useState } from 'react'
import { BsSearch } from 'react-icons/bs'

function Idle() {
  return (
    <>
      <p>Buscar</p>
      <BsSearch />
    </>
  )
}

function SearchTool() {
  return (
    <div className='flex items-center'>
      <input type="text" placeholder='Buscar...' className='w-32 bg-transparent'/>
      <BsSearch />
    </div>
  )
}

function Search() {
  const [hover, setHover] = useState(false)

  return (
    <div className='w-24 hover:w-40 hover:bg-gray-100 rounded-full bg-white flex justify-between items-center px-2 group overflow-clip' 
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}>
      
      {hover ?  <SearchTool/> : <Idle />}
    </div>
  )
}

export default Search