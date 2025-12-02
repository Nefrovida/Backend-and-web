import { Message, SimpleMessage } from "@/types/forum.types";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Title from "../atoms/Title";
import ParentMessage from "../molecules/forum/ParentMessage";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

const ReplyMessage = () => {
  const { messageId, forumId } = useParams();
  const [parentMessage, setParentMessage] = useState<SimpleMessage | null>(
    null
  );

  const { results, loading, error, scrollRef } = useInfiniteScroll<{
    data: Message[];
    pagination: unknown;
  }>(
    `/api/forums/${forumId}/messages/${messageId}/replies`,
    [],
    (page: number) => {
      const params = new URLSearchParams();
      params.append("page", page.toString());

      return params.toString();
    }
  );

  useEffect(() => {
    fetch(`/api/forums/message/${messageId}`)
      .then((res) => res.json())
      .then((data) => {
        setParentMessage({
          messageId: data.message_id,
          forumId: data.forum_id,
          content: data.content,
          user: {
            userId: data.user.user_id,
            userName: data.user.username,
          },
        } as SimpleMessage);
      })
      .catch((e) => console.log("error", e));
  }, [forumId, messageId]);

  return (
    <>
      <div>
        <Title>Mensajes</Title>
        {parentMessage && <ParentMessage message={parentMessage} />}
      </div>
    </>
  );
};

export default ReplyMessage;
