import { Reply, SimpleMessage } from "@/types/forum.types";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  const [parentMessage, setParentMessage] = useState<SimpleMessage | null>(
    null
  );
  const [refresh, setRefresh] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedReplyId, setSelectedReplyId] = useState<number | null>(null);
  const [deleteError, setDeleteError] = useState<string>("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

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

  const handleDeleteReply = (replyId: number) => {
    setSelectedReplyId(replyId);
    setIsDeleteModalOpen(true);
    setDeleteError("");
  };

  const handleConfirmDelete = async (replyId: number) => {
    try {
      setDeleteError("");
      await forumsService.deleteReply(replyId);

      // Remove reply from list
      results.splice(
        results.findIndex((r) => r.id === replyId),
        1
      );

      // Close modal and show success
      setIsDeleteModalOpen(false);
      setSelectedReplyId(null);
      setToast({
        message: "Respuesta eliminada exitosamente",
        type: "success",
      });
    } catch (err) {
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
      <div>
        <Link to={"/dashboard/foro"}>
          <Title size="large">Foro</Title>
        </Link>
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
        />
        <SendReply replyInfo={{ messageId, forumId }} refresh={setRefresh} />
      </div>

      {/* Delete Reply Modal */}
      <DeleteMessageModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        messageId={selectedReplyId}
        externalError={deleteError}
      />

      {/* Toast Notification */}
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
