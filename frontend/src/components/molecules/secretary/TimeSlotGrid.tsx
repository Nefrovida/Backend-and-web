// src/components/molecules/secretary/TimeSlotGrid.tsx
import type { FC } from "react";
import TimeSlotButton from "../../atoms/secretary/TimeSlotButton";

interface TimeSlotGridProps {
  availableSlots: string[];
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

const TimeSlotGrid: FC<TimeSlotGridProps> = ({
  availableSlots,
  selectedTime,
  onTimeSelect,
}) => {
  if (availableSlots.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <p>No hay horarios disponibles para la fecha seleccionada</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-3">
        Horarios Disponibles ({availableSlots.length} disponibles)
      </label>
      <div className="grid grid-cols-6 gap-3 max-h-96 overflow-y-auto p-3 bg-slate-50 rounded-lg border border-slate-200">
        {availableSlots.map((slot) => {
          const time = new Date(slot).toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          });
          return (
            <TimeSlotButton
              key={slot}
              time={time}
              isSelected={selectedTime === time}
              onClick={() => onTimeSelect(time)}
            />
          );
        })}
      </div>
    </div>
  );
};

export default TimeSlotGrid;
