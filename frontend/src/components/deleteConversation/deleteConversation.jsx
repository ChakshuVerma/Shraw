import ConfirmModal from "../modals/confirmModal";
import useDeleteConversation from "@/hooks/useDeleteConversation";
import { useState, useEffect } from "react";

// eslint-disable-next-line react/prop-types
const DeleteConveration = ({ conversationId, conversationName }) => {
  const [response, setResponse] = useState(false);
  const { loading, deleteConversation } = useDeleteConversation();

  const confirmMessage = `Are you sure you want to delete ${conversationName}`;
  const yesMessage = `Delete Chatroom`;
  const noMessage = "Cancel";
  const toggalModalMessage = "Delete";

  useEffect(() => {
    if (response) {
      deleteConversation(conversationId);
      setResponse(false);
    }
  }, [response, conversationId, deleteConversation]);

  return (
    !loading && (
      <ConfirmModal
        confirmMessage={confirmMessage}
        yesMessage={yesMessage}
        noMessage={noMessage}
        toggalModalMessage={toggalModalMessage}
        setResponse={setResponse}
      ></ConfirmModal>
    )
  );
};

export default DeleteConveration;
