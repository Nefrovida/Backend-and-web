import { BasicForumInfo } from "@/types/forum.types";
import { useEffect, useState } from "react";

export default function useSendMessage(
  onClick: () => void,
  setSuccess: ({
    status,
    message,
  }: {
    status: boolean;
    message: string;
  }) => void
) {
  const [content, setContent] = useState<string>("");
  const [forums, setForums] = useState<BasicForumInfo[]>();
  const [forumId, setForumId] = useState<number>();

  useEffect(() => {
    fetch("/api/forums/myForums/web")
      .then((res) => res.json())
      .then((data) => {
        const dataInfo = data.map((d) => {
          const { forumId, name } = d;
          return { forumId, name: name };
        });
        setForums(dataInfo);
      })
      .catch((e) => console.error(e));
  }, []);

  function handleCancel(): void {
    setContent("");
    onClick();
  }

  function handleSent(): void {
    if (!content || !forumId) {
      return;
    }
    fetch(`/api/forums/${forumId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ message: content }),
    })
      .then(async (res) => {
        if (res.ok) {
          setSuccess({ status: true, message: "Mensaje enviado" });
          return;
        } else {
          setSuccess({
            status: false,
            message: "El mensaje no pudo ser publicado",
          });
        }
      })
      .catch((e) => {
        console.error(e);
        setSuccess({ status: false, message: "Error al publicar mensaje" });
      });
    onClick();
  }

  return {
    forums,
    content,
    setContent,
    setForumId,
    handleCancel,
    handleSent,
  };
}
