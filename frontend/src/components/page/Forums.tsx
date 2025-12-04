import { useParams } from "react-router-dom";
import { useState } from "react";
import FeedList from "../organism/forum/FeedList";
import ForumList from "../organism/forum/ForumList";
import ForumSearch from "../organism/forum/ForumSearch";
import NewMessageComponent from "../organism/forum/NewMessageComponent";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { Message } from "@/types/forum.types";
import { DeleteMessageModal } from "../forums/DeleteMessageModal";
import { forumsService } from "@/services/forums/forums.service";
import { Toast } from "../forums/Toast";

const Forums = () => {
  const { forumId } = useParams();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState<number | null>(
    null
  );
  const [deleteError, setDeleteError] = useState<string>("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);

  let fId = Number(forumId);
  if (isNaN(fId)) {
    fId = null;
  }

  const messageInfo = useInfiniteScroll<Message>(
    `/api/forums/feed`,
    [fId],
    (page: number) => {
      const params = new URLSearchParams();
      params.append("page", page.toString());
      if (fId) params.append("forumId", fId.toString());
      return params.toString();
    }
  );

  const handleDeleteMessage = (messageId: number) => {
    setSelectedMessageId(messageId);
    setIsDeleteModalOpen(true);
    setDeleteError("");
  };

  const handleConfirmDelete = async (messageId: number) => {
    try {
      setDeleteError("");
      await forumsService.deleteMessage(messageId);

      // Remove message from list
      messageInfo.results.splice(
        messageInfo.results.findIndex((m) => m.messageId === messageId),
        1
      );

      // Close modal and show success
      setIsDeleteModalOpen(false);
      setSelectedMessageId(null);
      setToast({ message: "Mensaje eliminado exitosamente", type: "success" });
    } catch (err) {
      setDeleteError(err.message || "Error al eliminar el mensaje");
      console.error("Error deleting message:", err);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedMessageId(null);
    setDeleteError("");
  };

  return (
    <div className="w-full flex flex-col h-full overflow-hidden">
      <ForumSearch />
      <div className="flex w-full border-t-2 border-gray-200 pt-2 flex-grow h-full overflow-hidden">
        <aside className="w-1/6 max-sm:hidden mr-4">
          <ForumList />
        </aside>

        <div className="w-full h-full">
          <FeedList
            messageInfo={messageInfo}
            onDeleteMessage={handleDeleteMessage}
          />
        </div>

        <NewMessageComponent />
      </div>

      {/* Delete Message Modal */}
      <DeleteMessageModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        messageId={selectedMessageId}
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
    </div>
  );
};

export default Forums;
