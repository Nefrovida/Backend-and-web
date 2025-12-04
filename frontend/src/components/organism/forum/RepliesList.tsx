import MessageCard from "@/components/molecules/forum/MessageCard";
import Loading from "@/components/molecules/Loading";
import React, { FC } from "react";

interface Props {
  results: {
    id: number;
    content: string;
    liked: number;
    stats: { likesCount: number; repliesCount: number };
  }[];
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
      className="w-full flex flex-col gap-4 items-center mt-4 h-[23rem] overflow-scroll pt-10"
    >
      {loading && <Loading />}
      {!loading && results.length == 0 && (
        <div className="text-xl text-gray-500 text-center">No hay mensajes</div>
      )}
      {results.length > 0 &&
        results.map((m, idx) => (
          <MessageCard
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
            }}
            onDelete={onDeleteReply}
            key={idx}
          />
        ))}
    </ul>
  );
};

export default RepliesList;
