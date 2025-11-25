import NewMessageButton from "@/components/atoms/forum/NewMessageButton";
import SuccessModal from "@/components/atoms/SuccessModal";
import React, { useEffect, useState } from "react";
import NewMessageModal from "../../molecules/forum/NewMessageModal";

const NewMessageComponent = () => {
  const [success, setSuccess] = useState<{
    status: boolean;
    message: string;
  }>();

  useEffect(() => {
    setInterval(() => {
      setSuccess(null);
    }, 7000);
  }, [success]);

  const [showNewMessageModal, setShowNewMessageModal] =
    useState<boolean>(false);

  return (
    <>
      <NewMessageButton
        onClick={() => setShowNewMessageModal(true)}
        className={"fixed bottom-10 right-10"}
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
    </>
  );
};

export default NewMessageComponent;
