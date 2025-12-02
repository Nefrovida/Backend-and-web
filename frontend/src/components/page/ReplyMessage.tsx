import { Reply, SimpleMessage } from "@/types/forum.types";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Title from "../atoms/Title";
import ParentMessage from "../molecules/forum/ParentMessage";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import RepliesList from "../organism/forum/RepliesList";
import { VscSend } from "react-icons/vsc";

const ReplyMessage = () => {
  const { messageId, forumId } = useParams();
  const [parentMessage, setParentMessage] = useState<SimpleMessage | null>(
    null
  );

  const { results, scrollRef } = useInfiniteScroll<Reply>(
    `/api/forums/${forumId}/messages/${messageId}/replies`,
    [messageId, forumId],
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

  useEffect(() => {
    console.log(results);
  }, [results]);

  return (
    <>
      <div>
        <Link to={"/dashboard/foro"}>
          <Title size="large">Foro</Title>
        </Link>
        {parentMessage && <ParentMessage message={parentMessage} />}
        <RepliesList results={results} scrollRef={scrollRef} />
        <div className="shadow-sm shadow-gray-400 bg-gray-200 w-11/12 mr-60 rounded-md h-16 absolute bottom-5 flex items-center">
          <input
            type="text"
            className="w-full rounded-md inset-6 bg-white h-12 ml-2 align-text-top p-1"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white m-4 w-12 h-12 rounded-md flex items-center justify-center text-2xl">
            <VscSend />
          </button>
        </div>
      </div>
    </>
  );
};

export default ReplyMessage;
