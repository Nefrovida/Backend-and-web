import MessageCard from "@/components/molecules/forum/MessageCard";
import Loading from "@/components/molecules/Loading";
import React, { FC } from "react";
import { Reply } from "@/types/forum.types";

interface Props {
  results: Reply[];
  loading: boolean;
  forumId: string;
  scrollRef: React.RefObject<HTMLUListElement>;
  onDeleteReply?: (replyId: number) => void;
}

const RepliesList: FC<Props> = ({
  results,
  loading,
  scrollRef,
  forumId,
  onDeleteReply,
}) => {
  return (
    <ul
      ref={scrollRef}
      className="w-full flex flex-col gap-4 items-center mt-4 pb-24 pt-4"
    >
      {loading && <Loading />}
      {!loading && results.length === 0 && (
        <div className="text-xl text-gray-500 text-center">No hay mensajes</div>
      )}
      {results.length > 0 &&
        results.map((m) => {
          const displayName =
            [
              m.author?.name,
              m.author?.parentLastName,
              m.author?.maternalLastName,
            ]
              .filter(Boolean)
              .join(" ") || m.author?.username || "Usuario";

          return (
            <MessageCard
              key={m.id}
              message={{
                messageId: m.id,
                content: m.content,
                likes: m.stats.likesCount,
                liked: m.liked,
                replies: m.stats.repliesCount,
                forums: {
                  forumId: Number(forumId),
                  name: "",
                },
                userName: displayName,
              }}
              onDelete={onDeleteReply}
            />
          );
        })}
    </ul>
  );
};

export default RepliesList;