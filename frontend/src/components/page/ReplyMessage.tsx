import { Reply, Message } from "@/types/forum.types";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import Title from "../atoms/Title";
import ParentMessage from "../molecules/forum/ParentMessage";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import RepliesList from "../organism/forum/RepliesList";
import SendReply from "../organism/forum/SendReply";
import { DeleteMessageModal } from "../forums/DeleteMessageModal";
import { forumsService } from "@/services/forums/forums.service";
import { Toast } from "../forums/Toast";
import Loading from "../molecules/Loading";

const ReplyMessage = () => {
  const { messageId, forumId } = useParams();
  const location = useLocation();
  const locationState = location.state as { authorName?: string } | null;

  const [parentMessage, setParentMessage] = useState<Message | null>(null);
  const [refresh, setRefresh] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReplyId, setSelectedReplyId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string>("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  const { results, loading, scrollRef } = useInfiniteScroll<Reply>(
    `/api/forums/${forumId}/messages/${messageId}/replies`,
    [messageId, forumId, refresh],
    (page: number) => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      return params.toString();
    }
  );

  useEffect(() => {
    if (!messageId) return;

    fetch(`/api/forums/message/${messageId}`)
      .then((res) => res.json())
      .then((data) => {
        const authorName =
          locationState?.authorName || data.user.username || "Usuario";

        const parent: Message = {
          messageId: data.message_id,
          content: data.content,
          likes: 0,
          liked: 0,
          replies: 0,
          forums: {
            forumId: data.forum_id,
            name: "",
          },
          userName: authorName,
        };

        setParentMessage(parent);
      })
      .catch((e) => console.log("error", e));
  }, [forumId, messageId, locationState]);

  const handleDeleteReply = (replyId: number) => {
    setSelectedReplyId(replyId);
    setIsDeleteModalOpen(true);
    setDeleteError("");
  };

  const handleConfirmDelete = async (replyId: number) => {
    try {
      setDeleteError("");
      await forumsService.deleteReply(replyId);

      const idx = results.findIndex((r) => r.id === replyId);
      if (idx !== -1) {
        results.splice(idx, 1);
      }

      setIsDeleteModalOpen(false);
      setSelectedReplyId(null);
      setToast({
        message: "Respuesta eliminada exitosamente",
        type: "success",
      });
    } catch (err: any) {
      setDeleteError(err.message || "Error al eliminar la respuesta");
      console.error("Error deleting reply:", err);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedReplyId(null);
    setDeleteError("");
  };

  return (
    <>
      <div className="flex flex-col gap-4 pb-24">
        <Link to={"/dashboard/foro"}>
          <Title size="large">Foro</Title>
        </Link>

        <SendReply replyInfo={{ messageId, forumId }} refresh={setRefresh} />

        {parentMessage ? (
          <ParentMessage message={parentMessage} />
        ) : (
          <Loading />
        )}

        <RepliesList
          results={results}
          scrollRef={scrollRef}
          forumId={forumId}
          onDeleteReply={handleDeleteReply}
          loading={loading}
        />
      </div>

      <DeleteMessageModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        messageId={selectedReplyId}
        externalError={deleteError}
      />

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default ReplyMessage;