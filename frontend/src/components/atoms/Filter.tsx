import React, { FC, useState, useRef, useEffect } from 'react'
import { BsFilter, BsX } from 'react-icons/bs'

interface Props {
  show: React.ReactNode
}


const Filter: FC<Props> = ({show}) => {
  const [modal, setModal] = useState(false)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      // If we clicked outside the component, close it
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setModal(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])


  return (<div ref={wrapperRef}>
    <div 
      className={`w-24 rounded-full bg-white flex justify-between items-center px-2 cursor-pointer ${modal ? 'bg-red-600 hover:bg-red-500' : 'hover:bg-gray-100'}`}
      onClick={() => setModal(prev => !prev)}>
        <p>Filter</p>
        {modal ? <BsX/> : <BsFilter />}
    </div>
    {modal && show}
    </div>
  )
}

export default Filter