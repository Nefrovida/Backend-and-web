// src/components/molecules/secretary/DateSelector.tsx
import type { FC } from "react";
import { MdCalendarToday } from "react-icons/md";

interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
}

const DateSelector: FC<DateSelectorProps> = ({ selectedDate, onDateChange }) => {
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-700 mb-2">
        <MdCalendarToday className="inline mr-2 text-[#9AE5FB]" />
        Seleccionar Fecha
      </label>
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        min={today}
        className="w-full px-4 py-3 rounded-lg border-2 border-slate-300 bg-white text-slate-900 focus:border-[#9AE5FB] focus:outline-none transition-colors"
      />
    </div>
  );
};

export default DateSelector;
