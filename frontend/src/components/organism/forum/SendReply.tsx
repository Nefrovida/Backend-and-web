import React, { FC, useState } from "react";
import { VscSend } from "react-icons/vsc";

interface Props {
  replyInfo: { messageId: string; forumId: string };
  refresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const SendReply: FC<Props> = ({ replyInfo, refresh }) => {
  const [message, setMessage] = useState<string>("");

  function handleSendMessage(e) {
    e.preventDefault();
    if (!message) return;
    const messageInfo = {
      parent_message_id: replyInfo.messageId,
      content: message,
    };

    fetch(`/api/forums/${replyInfo.forumId}/replies`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify(messageInfo),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        refresh((prev) => !prev);
        setMessage("");
      })
      .catch((e) => console.log(e));
  }

  return (
    <form
      className="shadow-sm shadow-gray-400 bg-gray-200 w-11/12 mr-60 rounded-md h-16 absolute bottom-5 flex items-center"
      onSubmit={handleSendMessage}
    >
      <input
        type="text"
        onChange={(e) => setMessage(e.target.value)}
        value={message}
        className="w-full rounded-md inset-6 bg-white h-12 ml-2 align-text-top p-1"
        placeholder="Escribir..."
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white m-4 w-12 h-12 rounded-md flex items-center justify-center text-2xl"
      >
        <VscSend />
      </button>
    </form>
  );
};

export default SendReply;
