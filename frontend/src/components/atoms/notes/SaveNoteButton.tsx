import React, { FC } from 'react'
import Pill from '../Pill'

interface Props {
  save: () => void
}

const SaveNoteButton: FC<Props> = ({save}) => {
  return (
    <Pill text={'Guardar'} onClick={save} className='bg-green-300 hover:bg-green-400'/>
  )
}

export default SaveNoteButton