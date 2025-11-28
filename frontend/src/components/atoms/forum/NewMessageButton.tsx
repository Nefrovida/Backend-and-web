import React, { FC } from "react";
import { BsPlus } from "react-icons/bs";

interface Props {
  onClick: () => void;
  className?: string;
}

const NewMessageButton: FC<Props> = ({ onClick, className }) => {
  return (
    <button
      className={`bg-blue-600 hover:bg-blue-500 rounded-full ${className}`}
      onClick={onClick}
    >
      <BsPlus className="size-10" />
    </button>
  );
};

export default NewMessageButton;
