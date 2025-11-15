import React, { useState } from "react";
import NewMessageButton from "../atoms/forum/NewMessageButton";
import NewMessageModal from "../molecules/forum/NewMessageModal";

const Forums = () => {
  const [showNewMessageModal, setShowNewMessageModal] =
    useState<boolean>(false);

  return (
    <div className="w-full h-full">
      <NewMessageButton
        onClick={() => setShowNewMessageModal(true)}
        className={"absolute bottom-14 right-14"}
      />
      {showNewMessageModal && (
        <NewMessageModal onClick={() => setShowNewMessageModal(false)} />
      )}
    </div>
  );
};

export default Forums;
