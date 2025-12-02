import { Message } from "@/types/forum.types";
import { FC } from "react";
import MessageContent from "./MessageContent";
import { Link } from "react-router-dom";

interface Props {
  message: Message;
}

const MessageCard: FC<Props> = ({ message }) => {
  return (
    <div className="w-8/12 rounded-md border-2 bg-white drop-shadow-sm p-2">
      <section className="flex justify-between">
        <Link
          to={`${message.forums.forumId}`}
          className="text-gray-400 text-sm hover:underline"
        >
          {message.forums.name}
        </Link>
      </section>
      <MessageContent message={message} />
    </div>
  );
};

export default MessageCard;
