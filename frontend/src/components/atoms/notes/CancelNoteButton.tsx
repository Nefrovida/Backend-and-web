import React, { FC } from 'react'
import Pill from '../Pill'

interface Props {
  closeModal: () => void
}

const CancelNoteButton: FC<Props> = ({closeModal}) => {
  return (
    <Pill text={'Cancelar'} onClick={closeModal} className='bg-gray-300 hover:bg-gray-400'/>
  )
}

export default CancelNoteButton