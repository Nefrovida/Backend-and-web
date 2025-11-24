import MessageCard from "@/components/molecules/forum/MessageCard";
import { Message } from "@/types/forum.types";
import React, { FC, memo, RefObject } from "react";

interface Props {
  messageInfo: {
    results: Message[];
    loading: boolean;
    hasMore: boolean;
    error: string;
    scrollRef: RefObject<HTMLUListElement>;
    handleSearch: () => void;
    handleFilter: () => void;
  };
}

const MemoizedMessageCard = memo(MessageCard);

const FeedList: FC<Props> = ({ messageInfo }) => {
  const { results: messages, loading, scrollRef, error } = messageInfo;
  return (
    <ul
      className="flex flex-col items-center gap-4 overflow-scroll h-[95%]"
      ref={scrollRef}
    >
      {messages.length > 0 &&
        !loading &&
        !error &&
        messages.map((m) => (
          <MemoizedMessageCard
            f={m.forums}
            content={m.content}
            likes={m.likes}
            comments={m.replies}
            key={m.messageId}
          />
        ))}
    </ul>
  );
};

export default FeedList;
