import toast from "react-hot-toast";
import { useContext, useState } from "react";
import conversationListContext from "@/context/conversationListContext";
import ConfirmModal from "../modals/confirmModal";

/* eslint-disable react/prop-types */
const LeaveConversation = ({ conversationName, conversationId }) => {
  const { conversationListChanged, setConversationListChanged } = useContext(
    conversationListContext
  );

  const [response, setResponse] = useState(false);

  const handleClick = async () => {
    if (response) {
      try {
        const res = await fetch("/api/conversations/leave", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId,
          }),
        });

        const data = await res.json();

        if (data.error) {
          toast.error(data.error);
        } else {
          setConversationListChanged(!conversationListChanged);
          toast.success(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  handleClick();

  const confirmMessage = `Are you sure you want to leave ${conversationName}? You won't be able to retrieve the data from this conversation`;
  const yesMessage = "Leave Conversation";
  const noMessage = "Cancel";
  const toggalModalMessage = "Leave this conversation";

  return (
    <>
      <ConfirmModal
        confirmMessage={confirmMessage}
        yesMessage={yesMessage}
        noMessage={noMessage}
        toggalModalMessage={toggalModalMessage}
        setResponse={setResponse}
      ></ConfirmModal>
    </>
  );
};

export default LeaveConversation;
