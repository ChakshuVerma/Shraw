import ConfirmModal from "../modals/confirmModal";
import useDeleteConversation from "@/hooks/useDeleteConversation";
import { useState, useContext, useEffect } from "react";
import conversationListContext from "@/context/conversationListContext";

// eslint-disable-next-line react/prop-types
const DeleteConveration = ({ conversationId, conversationName }) => {
  const [response, setResponse] = useState(false);
  const { loading, deleteConversation } = useDeleteConversation();
  const { conversationListChanged, setConversationListChanged } = useContext(
    conversationListContext
  );

  const confirmMessage = `Are you sure you want to delete ${conversationName}`;
  const yesMessage = `Delete ${conversationName}`;
  const noMessage = "Cancel";
  const toggalModalMessage = "Delete";

  useEffect(() => {
    if (response) {
      deleteConversation(conversationId);
      setConversationListChanged(!conversationListChanged);
      setResponse(false);
    }
  }, [
    response,
    conversationId,
    conversationListChanged,
    deleteConversation,
    setConversationListChanged,
  ]);

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
