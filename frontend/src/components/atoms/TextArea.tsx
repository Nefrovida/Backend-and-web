import { FC, useState } from "react";

interface Props {
  className?: string;
  onChange: (v: string) => void;
  maxLength?: number;
  value?: string;
}

const TextArea: FC<Props> = ({ className, onChange, maxLength, value }) => {
  const [charCount, setCharCount] = useState(value?.length || 0);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setCharCount(newValue.length);
    onChange(newValue);
  };

  return (
    <div className="w-full">
      <textarea
        className={`w-full p-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${className}`}
        onChange={handleChange}
        maxLength={maxLength}
        value={value}
      />
      {maxLength && (
        <div className="text-right text-xs text-gray-500 mt-1">
          {charCount} / {maxLength}
        </div>
      )}
    </div>
  );
};

export default TextArea;