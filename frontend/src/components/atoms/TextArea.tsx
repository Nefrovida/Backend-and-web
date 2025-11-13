import React, { FC } from 'react'

interface Props {
  className?: string
}

const TextArea: FC<Props> = ({className}) => {
  return (
    <textarea name="" id="" className={`bg-gray-100 rounded-md border-gray-200 w-full ${className}`}>

    </textarea>
  )
}

export default TextArea