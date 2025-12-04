import MessageCard from "@/components/molecules/forum/MessageCard";
import Loading from "@/components/molecules/Loading";
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
  const { results: messages, loading, scrollRef } = messageInfo;
  return (
    <ul
      className="flex flex-col items-center gap-4 overflow-scroll h-[95%]"
      ref={scrollRef}
    >
      {loading && messages.length <= 0 && <Loading />}
      {messages.map((m: Message) => (
        <MemoizedMessageCard
          key={m.messageId}
          message={m}
          onDelete={onDeleteMessage}
        />
      ))}
    </ul>
  );
};

export default FeedList;
