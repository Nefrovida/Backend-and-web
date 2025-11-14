import { FC } from "react"

interface Props {
  className?: string
  onChange: (v: string) => void
}

const TextArea: FC<Props> = ({className, onChange}) => {
  return (
    <textarea name="" id="" 
    className={`bg-gray-100 rounded-md border-gray-200 w-full p-2 ${className}`}
    onChange={(v) => onChange(v.target.value)}>

    </textarea>
  )
}

export default TextArea