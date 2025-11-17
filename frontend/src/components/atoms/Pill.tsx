import React, { FC, ReactNode } from "react";

interface Props {
  text: string;
  icon?: ReactNode;
  className?: string;
  onClick: () => void;
}

const Pill: FC<Props> = ({ text, icon, className, onClick }) => {
  return (
    <div
      className={`rounded-full flex justify-around items-center px-2 cursor-pointer gap-2 h-10 text-center ${
        className ?? "bg-white"
      }`}
      onClick={onClick}
    >
      <span className="mb-1 text-center">{text}</span>
      {icon && <span className="text-xl">{icon}</span>}
    </div>
  );
};

export default Pill;
