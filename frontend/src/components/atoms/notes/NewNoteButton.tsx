import React, { FC } from 'react'
import Pill from '../Pill'
import {BsPlus} from "react-icons/bs"

interface Props {
  openModal: () => void,
}

const NewNoteButton: FC<Props> = ({openModal}) =>  {
  return (
    <Pill text='Nueva nota' icon={<BsPlus/>} className='bg-green-300 hover:bg-green-400' onClick={openModal}/>
  )
}

export default NewNoteButton