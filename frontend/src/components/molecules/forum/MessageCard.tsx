import { Message } from "@/types/forum.types";
import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "@/services/auth.service";
import { ROLE_IDS } from "@/types/auth.types";
import { HiDotsHorizontal } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiLike, BiSolidLike } from "react-icons/bi";
import { MdChatBubbleOutline } from "react-icons/md";

interface Props {
  message: Message;
  onDelete: (messageId: number) => void;
}

const MessageCard: FC<Props> = ({ message, onDelete }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [like, setLike] = useState(message.liked);
  const currentUser = authService.getCurrentUser();
  const isAdmin = currentUser?.role_id === ROLE_IDS.ADMIN;

  const handleDeleteClick = () => {
    setShowMenu(false);
    onDelete(message.messageId);
  };

  const handleLike = () => {
    setLike((prev) => {
      if (prev) {
        return 0;
      } else {
        return 1;
      }
    });
    fetch(`/api/forums/like/${message.messageId}`, {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .catch((e) => console.error(e));
  };

  return (
    <div className="w-8/12 rounded-md border-2 bg-white drop-shadow-sm p-2">
      <section className="flex justify-between">
        <Link
          to={`/dashboard/foro/${message.forums.forumId}`}
          className="text-gray-400 text-sm hover:underline"
        >
          {message.forums.name}
        </Link>
        {isAdmin && (
          <div className="relative">
            <HiDotsHorizontal
              className="hover:text-blue-600 cursor-pointer"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                <button
                  onClick={handleDeleteClick}
                  className="flex items-center gap-2 w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <RiDeleteBin6Line className="text-lg" />
                  <span className="text-sm font-medium">Eliminar mensaje</span>
                </button>
              </div>
            )}
          </div>
        )}
        {!isAdmin && (
          <HiDotsHorizontal className="text-gray-300 cursor-not-allowed" />
        )}
      </section>
      <section className="w-full text-lg my-2">{message.content}</section>
      <section className="flex gap-4 items-center">
        <button className="flex gap-2 items-center" onClick={handleLike}>
          {like ? (
            <BiSolidLike className="text-blue-600" />
          ) : (
            <BiLike className="hover:text-blue-600" />
          )}
          {message.likes + like}
        </button>
        <Link
          className="flex gap-2 items-center"
          to={`/dashboard/foro/${message.forums.forumId}/mensaje/${message.messageId}`}
        >
          <MdChatBubbleOutline className="hover:text-blue-600" />
          {message.replies}
        </Link>
      </section>
    </div>
  );
};

export default MessageCard;
