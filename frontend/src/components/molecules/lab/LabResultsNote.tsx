import React from 'react'
import { Card } from 'actify'
import Title from '@/components/atoms/Title'

function LabResultsNote(props: {
  title: string,
  subtitle: string,
  inputValue: string,
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className=''>
      <Title size={"small"}>{props.title}</Title>
      <Card
       className="w-full h-[8rem] p-2 mb-2 shadow-md-elevated-2"
       elevation={3}
      >
      <input
        className="w-full outline-none"
        type="text"
        placeholder={props.subtitle}
        value={props.inputValue}
        onChange={props.handleChange}
        />
      </Card>
    </div>
  )
}

export default LabResultsNote