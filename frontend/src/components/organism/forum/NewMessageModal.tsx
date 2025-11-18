import TextArea from "@/components/atoms/TextArea";
import Title from "@/components/atoms/Title";
import SelectForum from "@/components/molecules/forum/SelectForum";
import SubmitButtons from "@/components/molecules/forum/SubmitButtons";
import useSendMessage from "@/hooks/useSendMessage";
import React, { FC } from "react";

interface Props {
  onClick: () => void;
  setSuccess: ({
    status,
    message,
  }: {
    status: boolean;
    message: string;
  }) => void;
}

const NewMessageModal: FC<Props> = ({ onClick, setSuccess }) => {
  const { forums, content, setContent, setForumId, handleCancel, handleSent } =
    useSendMessage(onClick, setSuccess);

  return (
    <section
      className="absolute top-0 left-0 w-screen h-screen bg-gray-500 bg-opacity-55 flex items-center justify-center"
      onClick={onClick}
    >
      <div
        className="bg-white w-1/3 h-2/3 rounded-xl p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <Title>Nuevo Mensaje</Title>
        <SelectForum setForumId={setForumId} forums={forums} />

        <h2 className="text-lg mb-1">Mensaje</h2>
        <TextArea
          onChange={setContent}
          value={content}
          maxLength={2000}
          className="h-52"
        />
        <SubmitButtons handleCancel={handleCancel} handleSent={handleSent} />
      </div>
    </section>
  );
};

export default NewMessageModal;
