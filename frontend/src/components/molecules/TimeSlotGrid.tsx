import React from 'react';
import TimeSlot from '../atoms/TimeSlot';

interface TimeSlotGridProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00'
];

const TimeSlotGrid: React.FC<TimeSlotGridProps> = ({ 
  selectedTime, 
  onTimeSelect 
}) => {
  return (
    <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto p-2 bg-gray-50 rounded-lg">
      {TIME_SLOTS.map((slot) => (
        <TimeSlot
          key={slot}
          time={slot}
          selected={selectedTime === slot}
          onClick={() => onTimeSelect(slot)}
        />
      ))}
    </div>
  );
};

export default TimeSlotGrid;