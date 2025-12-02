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
  onDeleteMessage?: (messageId: number) => void;
}

const MemoizedMessageCard = memo(MessageCard);

const FeedList: FC<Props> = ({ messageInfo, onDeleteMessage }) => {
  const { results: messages, scrollRef } = messageInfo;
  return (
    <ul
      className="flex flex-col items-center gap-4 overflow-scroll h-[95%]"
      ref={scrollRef}
    >
      {messages.map((m) => (
        <MemoizedMessageCard
          messageId={m.messageId}
          f={m.forums}
          content={m.content}
          likes={m.likes}
          comments={m.replies}
          key={m.messageId}
          onDelete={onDeleteMessage}
        />
      ))}
    </ul>
  );
};

export default FeedList;
