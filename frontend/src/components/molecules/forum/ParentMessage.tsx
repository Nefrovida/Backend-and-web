import { SimpleMessage } from "@/types/forum.types";
import React, { FC } from "react";

interface Props {
  message: SimpleMessage;
}

const ParentMessage: FC<Props> = ({ message }) => {
  return (
    <div className="w-full h-44 flex justify-center">
      <div className=" w-1/3 text-xl inset-shadow-gray-600 rounded-md shadow-md p-4">
        <h1 className="text-2xl">@{message.user.userName}</h1>
        <span className="p-2">{message.content}</span>
      </div>
    </div>
  );
};

export default ParentMessage;
