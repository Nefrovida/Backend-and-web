import React, { useEffect, useState } from "react";
import NewMessageButton from "../atoms/forum/NewMessageButton";
import NewMessageModal from "../organism/forum/NewMessageModal";
import SuccessModal from "../atoms/SuccessModal";

const Forums = () => {
  const [showNewMessageModal, setShowNewMessageModal] =
    useState<boolean>(false);
  const [success, setSuccess] = useState<{
    status: boolean;
    message: string;
  }>();

  useEffect(() => {
    console.log(success);
    setInterval(() => {
      setSuccess(null);
    }, 7000);
  }, [success]);

  return (
    <div className="w-full h-full">
      <NewMessageButton
        onClick={() => setShowNewMessageModal(true)}
        className={"absolute bottom-14 right-14"}
      />
      {showNewMessageModal && (
        <NewMessageModal
          onClick={() => setShowNewMessageModal(false)}
          setSuccess={setSuccess}
        />
      )}
      {success && (
        <SuccessModal status={success.status} message={success.message} />
      )}
    </div>
  );
};

export default Forums;
