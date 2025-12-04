import { SimpleMessage } from "@/types/forum.types";
import React, { FC } from "react";
import { MdOutlineChevronLeft } from "react-icons/md";
import { useNavigate } from "react-router-dom";

interface Props {
  message: SimpleMessage;
}

const ParentMessage: FC<Props> = ({ message }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-center px-4">
      <MdOutlineChevronLeft
        className="text-3xl absolute top-30 left-10 rounded-md hover:bg-gray-300 cursor-pointer"
        onClick={() => {
          navigate(-1);
        }}
      />
      <div className="w-full max-w-3xl text-base sm:text-lg rounded-md shadow-md p-4 bg-white break-words whitespace-pre-wrap">
        <h1 className="text-xl sm:text-2xl font-semibold mb-2">
          {message.user.userName}
        </h1>
        <p className="p-2">
          {message.content}
        </p>
      </div>
    </div>
  );
};

export default ParentMessage;