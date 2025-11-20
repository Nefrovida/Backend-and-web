import React from 'react'
import { Card } from 'actify'
import Title from '@/components/atoms/Title'

function LabResultsNote(props: {
  title: string,
  subtitle: string,
  inputValue: string,
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className='mb-6'>
      <Title size={"small"}>{props.title}</Title>
      <Card
       className="w-full h-[8rem] p-0 mb-2 shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden"
       elevation={0}
      >
      <textarea
        className="w-full h-full outline-none bg-transparent text-gray-700 placeholder-gray-400 p-4 resize-none"
        placeholder={props.subtitle}
        value={props.inputValue}
        onChange={props.handleChange}
        rows={4}
        />
      </Card>
    </div>
  )
}

export default LabResultsNote