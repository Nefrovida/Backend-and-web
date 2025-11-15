import React, { FC, useState } from 'react'
import { BsSearch } from 'react-icons/bs'

interface Props {
  onChange: (name: string) => void
}

function Idle() {
  return (
    <>
      <p>Buscar</p>
      <BsSearch />
    </>
  )
}

const SearchTool: FC<Props> = ({onChange}) => {
  return (
    <div className='flex items-center'>
      <input type="text" placeholder='Buscar...' className='w-32 bg-transparent' 
        onChange={(e) => onChange(e.target.value)}/>
      <BsSearch />
    </div>
  )
}

const Search: FC<Props> = ({onChange})  => {
  const [active, setActive] = useState(false)

  return (
    <div className={`w-24 rounded-full bg-white flex justify-between items-center px-2 group overflow-clip ${active && 'w-40 bg-gray-100'}` }
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        if (!document.activeElement || document.activeElement.tagName !== "INPUT")
          setActive(false);
      }}>
      
      {active ?  
        <div onFocus={() => setActive(true)} onBlur={() => setActive(false)}>
          <SearchTool onChange={onChange} />
        </div>
        : <Idle />}
    </div>
  )
}

export default Search