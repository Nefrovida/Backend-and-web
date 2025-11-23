import { BasicForumInfo } from "@/types/forum.types";
import { Link } from "react-router-dom";
import { HiDotsHorizontal } from "react-icons/hi";
import { BiLike } from "react-icons/bi";
import { FC } from "react";
import { MdChatBubbleOutline } from "react-icons/md";

interface Props {
  f: BasicForumInfo;
  content: string;
  likes: number;
  comments: number;
}

const MessageCard: FC<Props> = ({ f, content, likes, comments }) => {
  return (
    <div className="w-8/12 rounded-md border-2 bg-white drop-shadow-sm p-2">
      <section className="flex justify-between">
        <Link
          to={`${f.forumId}`}
          className="text-gray-400 text-sm hover:underline"
        >
          {f.name}
        </Link>
        <HiDotsHorizontal />
      </section>
      <section className="w-full text-lg my-2">{content}</section>
      <section className="flex gap-4 items-center">
        <div className="flex gap-2 items-center">
          <BiLike className="hover:text-blue-600" />
          {likes}
        </div>
        <div className="flex gap-2 items-center">
          <MdChatBubbleOutline className="hover:text-blue-600" />
          {comments}
        </div>
      </section>
    </div>
  );
};

export default MessageCard;
