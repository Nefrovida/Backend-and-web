import { Reply, SimpleMessage } from "@/types/forum.types";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Title from "../atoms/Title";
import ParentMessage from "../molecules/forum/ParentMessage";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import RepliesList from "../organism/forum/RepliesList";
import SendReply from "../organism/forum/SendReply";

const ReplyMessage = () => {
  const { messageId, forumId } = useParams();
  const [parentMessage, setParentMessage] = useState<SimpleMessage | null>(
    null
  );
  const [refresh, setRefresh] = useState(false);

  const { results, scrollRef } = useInfiniteScroll<Reply>(
    `/api/forums/${forumId}/messages/${messageId}/replies`,
    [messageId, forumId, refresh],
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
        <Link to={"/dashboard/foro"}>
          <Title size="large">Foro</Title>
        </Link>
        {parentMessage && <ParentMessage message={parentMessage} />}
        <RepliesList
          results={results}
          scrollRef={scrollRef}
          forumId={forumId}
        />
        <SendReply replyInfo={{ messageId, forumId }} refresh={setRefresh} />
      </div>
    </>
  );
};

export default ReplyMessage;
