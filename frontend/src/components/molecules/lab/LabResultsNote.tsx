import React from 'react'
import { Card } from 'actify'
import Title from '@/components/atoms/Title'
import Status from '@/components/atoms/Status'

function LabResultsNote(props: {
  title: string,
  subtitle: string,
  inputValue: string,
  enabled: boolean,
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className='mb-6'>
      <Title size={"small"}>{props.title}</Title>

      <Card
        className="relative w-full h-[8rem] p-0 mb-2 shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden"
        elevation={0}
      >

        <textarea
          disabled={!props.enabled}
          className="w-full h-full outline-none bg-transparent text-gray-700 placeholder-gray-400 p-4 resize-none text-lg"
          placeholder={props.enabled ? props.subtitle : ""}
          value={props.inputValue}
          onChange={props.handleChange}
          rows={4}
        />

        {!props.enabled && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60">
              <Status status="default" message="No se puede generar reporte sin resultados de laboratorio" />
            </div>
        )}
      </Card>
    </div>
  )
}

export default LabResultsNote