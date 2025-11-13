import React, { FC, ReactNode } from 'react'

interface Props {
  text: string,
  icon?: ReactNode,
  className?: string,
  onClick: () => void
}

const Pill: FC<Props> = ({text, icon, className, onClick}) =>  {
  return (
    <div 
      className={`rounded-full bg-white flex justify-between items-center px-2 cursor-pointer gap-2 h-10 text-center ${className}`}
      onClick={onClick}
    >
      <span className='mb-1'>{text}</span>
      <span className='text-xl'>{icon}</span>
    </div>
  )
}

export default Pill