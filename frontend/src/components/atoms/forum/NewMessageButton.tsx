import React, { FC } from "react";
import { BsPlus } from "react-icons/bs";

interface Props {
  onClick: () => void;
  className?: string;
}

const NewMessageButton: FC<Props> = ({ onClick, className }) => {
  return (
    <button
      className={`bg-green-400 hover:bg-green-500 rounded-full ${className}`}
      onClick={onClick}
    >
      <BsPlus className="size-10" />
    </button>
  );
};

export default NewMessageButton;
