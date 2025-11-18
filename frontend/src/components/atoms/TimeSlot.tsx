import React from 'react';

interface TimeSlotProps {
  time: string;
  selected: boolean;
  onClick: () => void;
}

const TimeSlot: React.FC<TimeSlotProps> = ({ time, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-3 rounded text-xs font-medium transition-colors ${
        selected
          ? 'bg-blue-600 text-white'
          : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
      }`}
    >
      {time}
    </button>
  );
};

export default TimeSlot;