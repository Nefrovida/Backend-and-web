import { Message } from "@/types/forum.types";
import React, { FC } from "react";
import { BiLike } from "react-icons/bi";
import { MdChatBubbleOutline } from "react-icons/md";
import { Link } from "react-router-dom";

interface Props {
  message: Message;
}

const MessageContent: FC<Props> = ({ message }) => {
  function handleLike() {}

  return (
    <>
      <section className="w-full text-lg my-2">{message.content}</section>
      <section className="flex gap-4 items-center">
        <button className="flex gap-2 items-center" onClick={handleLike}>
          <BiLike className="hover:text-blue-600" />
          {message.likes}
        </button>
        <Link
          className="flex gap-2 items-center"
          to={`/dashboard/foro/${message.forums.forumId}/mensaje/${message.messageId}`}
        >
          <MdChatBubbleOutline className="hover:text-blue-600" />
          {message.replies}
        </Link>
      </section>
    </>
  );
};

export default MessageContent;
