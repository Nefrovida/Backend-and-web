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
  const trimmedMessage = message.trim();

  function handleChange(content: string) {
    // Enforce max length in frontend
    if (content.length <= 5000) {
      setMessage(content);
      setError(null);
    } else {
      setMessage(content.substring(0, 5000));
      setError("El mensaje no puede exceder 5000 carácteres");
    }
  }

  useEffect(() => {
    if (message.length <= 5000) setError(null);
  }, [message]);

  function handleSendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Prevent sending empty or whitespace-only messages
    if (!trimmedMessage || error || loading) return;

    setLoading(true);
    const messageInfo = {
      parent_message_id: replyInfo.messageId,
      content: trimmedMessage,
    };

    fetch(`/api/forums/${replyInfo.forumId}/replies`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      credentials: "include",
      body: JSON.stringify(messageInfo),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        refresh((prev) => !prev);
        setMessage("");
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-20 flex flex-col items-center px-4 pb-4 pt-2">
      <form
        className={`shadow-sm shadow-gray-300 bg-gray-100 max-w-3xl w-full rounded-md flex items-center gap-2 px-2 py-2 ${error ? "border border-red-400" : ""
          }`}
        onSubmit={handleSendMessage}
      >
        <textarea
          onChange={(e) => handleChange(e.target.value)}
          value={message}
          className="w-full rounded-md bg-white min-h-[2.5rem] max-h-32 ml-1 align-text-top p-2 break-words overflow-y-auto resize-y text-sm"
          placeholder="Escribir..."
          maxLength={5000}
        />

        {/* Character counter */}
        <span className="ml-1 text-[11px] text-gray-500 whitespace-nowrap">
          {message.length}/5000
        </span>

        <button
          type="submit"
          disabled={!trimmedMessage || !!error || loading}
          className={`bg-blue-600 hover:bg-blue-700 text-white w-11 h-11 rounded-md flex items-center justify-center text-2xl ${(loading || !trimmedMessage || error) &&
            "bg-gray-400 cursor-not-allowed hover:bg-gray-400"
            }`}
        >
          {loading ? <Loading /> : <VscSend />}
        </button>
      </form>

      {error && (
        <p className="text-red-500 text-xs mt-1 text-center max-w-3xl">
          {error}
        </p>
      )}
    </div>
  );
};

export default SendReply;