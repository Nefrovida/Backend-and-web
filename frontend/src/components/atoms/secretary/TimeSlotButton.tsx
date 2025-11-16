// src/components/atoms/secretary/TimeSlotButton.tsx
import type { FC } from "react";
import { MdAccessTime } from "react-icons/md";

interface TimeSlotButtonProps {
  time: string;
  isSelected: boolean;
  onClick: () => void;
}

const TimeSlotButton: FC<TimeSlotButtonProps> = ({ time, isSelected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={[
        "flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-all font-medium",
        isSelected
          ? "bg-[#9AE5FB] border-[#8ADDFB] text-slate-800 shadow-md"
          : "bg-white border-slate-300 text-slate-700 hover:border-[#9AE5FB] hover:bg-[#F0FBFF]",
      ].join(" ")}
    >
      <MdAccessTime className="text-lg" />
      <span className="font-medium">{time}</span>
    </button>
  );
};

export default TimeSlotButton;
