import React, { FC } from "react";
import { BsCheck2Circle, BsXCircle } from "react-icons/bs";

interface Props {
  status: boolean;
  message: string;
}

const SuccessModal: FC<Props> = ({ status, message }) => {
  return (
    <div className="w-full h-12 mt-2 flex justify-center absolute">
      <div className="px-3 h-full bg-white drop-shadow-md rounded-md flex gap-5 text-lg items-center justify-center">
        {status ? (
          <BsCheck2Circle className="text-green-600 size-10" />
        ) : (
          <BsXCircle className="text-red-600 size-10" />
        )}
        {message}
      </div>
    </div>
  );
};

export default SuccessModal;
