import MessageCard from "@/components/molecules/forum/MessageCard";
import React, { FC } from "react";

interface Props {
  results: { id: number; content: string }[];
  scrollRef: React.RefObject<HTMLUListElement>;
}

const RepliesList: FC<Props> = ({ results, scrollRef }) => {
  return (
    <ul
      ref={scrollRef}
      className="w-full flex justify-center flex-col gap-4 items-center mt-4 h-96 overflow-scroll pt-10"
    >
      {results.map((m, idx) => (
        <MessageCard
          message={{
            messageId: m.id,
            content: m.content,
            likes: 0,
            replies: 0,
            forums: {
              forumId: 0,
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
