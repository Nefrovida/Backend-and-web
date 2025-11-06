import React from 'react'
import { BsFilter } from 'react-icons/bs'

function Filter() {
  return (
    <div className='w-24 hover:bg-gray-100 rounded-full bg-white flex justify-between items-center px-2 cursor-pointer'>
        <p>Filter</p>
        <BsFilter />
    </div>
  )
}

export default Filter