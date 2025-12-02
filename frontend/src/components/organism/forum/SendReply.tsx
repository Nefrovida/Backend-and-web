import Loading from "@/components/molecules/Loading";
import React, { FC, useEffect, useState } from "react";
import { VscSend } from "react-icons/vsc";

interface Props {
  replyInfo: { messageId: string; forumId: string };
  refresh: React.Dispatch<React.SetStateAction<boolean>>;
}

const SendReply: FC<Props> = ({ replyInfo, refresh }) => {
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleChange(content: string) {
    if (content.length < 5000) setMessage(content);
    else {
      setMessage(content.substring(0, 5000));
      setError("El mensaje no puede exceder 5000 carácteres");
    }
  }
  useEffect(() => {
    if (message.length < 50000) setError(null);
  }, [message]);

  function handleSendMessage(e) {
    e.preventDefault();
    if (!message || error || loading) return;
    setLoading(true);
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
        setLoading(false);
      })
      .catch((e) => console.log(e));
  }

  return (
    <>
      <form
        className={`shadow-sm shadow-gray-400 bg-gray-200 w-11/12 mr-60 rounded-md h-16 absolute  flex items-center ${
          error ? "bg-red-500 bottom-10" : "bottom-5"
        }`}
        onSubmit={handleSendMessage}
      >
        <input
          type="text"
          onChange={(e) => handleChange(e.target.value)}
          value={message}
          className={`w-full rounded-md inset-6 bg-white h-12 ml-2 align-text-top p-1`}
          placeholder="Escribir..."
          min="1"
          max="5000"
        />

        <button
          type="submit"
          className={`bg-blue-600 hover:bg-blue-700 text-white m-4 w-12 h-12 rounded-md flex items-center justify-center text-2xl ${
            loading && "bg-gray-500"
          }`}
        >
          {loading ? <Loading /> : <VscSend />}
        </button>
      </form>
      {error && <p className="text-red-500 absolute bottom-4">{error}</p>}
    </>
  );
};

export default SendReply;
