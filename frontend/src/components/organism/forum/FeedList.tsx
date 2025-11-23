import MessageCard from "@/components/molecules/forum/MessageCard";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Message } from "@/types/forum.types";
import React, { memo } from "react";

const MemoizedMessageCard = memo(MessageCard);

const FeedList = () => {
  const {
    results: messages,
    loading,
    scrollRef,
    error,
  } = useInfiniteScroll<Message>("/api/forums/feed", [], (page: number) => {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    return params.toString();
  });

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
