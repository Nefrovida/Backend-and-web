import MessageCard from "@/components/molecules/forum/MessageCard";
import React, { FC } from "react";

interface Props {
  results: {
    id: number;
    content: string;
    stats: { likesCount: number; repliesCount: number };
  }[];
  forumId: string;
  scrollRef: React.RefObject<HTMLUListElement>;
}

const RepliesList: FC<Props> = ({ results, scrollRef, forumId }) => {
  return (
    <ul
      ref={scrollRef}
      className="w-full flex flex-col gap-4 items-center mt-4 h-[23rem] overflow-scroll pt-10"
    >
      {results.map((m, idx) => (
        <MessageCard
          message={{
            messageId: m.id,
            content: m.content,
            likes: m.stats.likesCount,
            replies: m.stats.repliesCount,
            forums: {
              forumId: Number(forumId),
              name: "",
            },
          }}
          key={idx}
        />
      ))}
    </ul>
  );
};

export default RepliesList;
