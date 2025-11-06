import React from 'react'
import { BsSearch } from 'react-icons/bs'

function Search() {
  return (
    <div className='w-10 hover:w-24 rounded-full bg-gray-400 flex justify-around'>
        <BsSearch />
        <p>Buscar</p>
    </div>
  )
}

export default Search