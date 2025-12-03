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
    <div className="w-full min-h-44 flex justify-center">
      <MdOutlineChevronLeft
        className="text-3xl absolute top-30 left-10 rounded-md hover:bg-gray-300"
        onClick={() => {
          navigate(-1);
        }}
      />
      <div className=" w-1/3 text-xl inset-shadow-gray-600 rounded-md shadow-md p-4">
        <h1 className="text-2xl">@{message.user.userName}</h1>
        <span className="p-2">{message.content}</span>
      </div>
    </div>
  );
};

export default ParentMessage;
