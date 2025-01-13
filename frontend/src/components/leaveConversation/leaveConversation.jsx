import toast from "react-hot-toast";
import { useContext, useState, useEffect } from "react";
import conversationListContext from "@/context/conversationListContext";
import ConfirmModal from "../modals/confirmModal";
import { APIEndpoints } from "@/constants/constants";
/* eslint-disable react/prop-types */
const LeaveConversation = ({ conversationName, conversationId }) => {
  const { conversationListChanged, setConversationListChanged } = useContext(
    conversationListContext
  );

  const [response, setResponse] = useState(false);

  useEffect(() => {
    if (!response) return;
    const leaveConvo = async () => {
      const res = await fetch(`${APIEndpoints.CONVERSATION}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      } else {
        setConversationListChanged(!conversationListChanged);
        return data;
      }
    };
    toast.promise(leaveConvo(), {
      loading: "Leaving conversation...",
      success: (data) => data.message,
      error: (err) => err.message,
    });
    setResponse(false);
  }, [response]);

  const confirmMessage = `Are you sure you want to leave ${conversationName}? You won't be able to retrieve the data from this conversation`;
  const yesMessage = "Leave Conversation";
  const noMessage = "Cancel";
  const toggalModalMessage = "Leave conversation";

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
