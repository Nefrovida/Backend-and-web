import React, { FC } from 'react'

interface Props {
  text: string
}

const Subtitle: FC<Props> = ({text}) => {
  return (
    <h1 className='text-xl font-semibold mb-2'>
      {text}
    </h1>
  )
}

export default Subtitle