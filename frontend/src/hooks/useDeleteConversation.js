import toast from "react-hot-toast";
import { useState, useContext } from "react";
import { APIEndpoints } from "@/constants/constants";
import conversationListContext from "@/context/conversationListContext";

const useDeleteConversation = () => {
  const { conversationListChanged, setConversationListChanged } = useContext(
    conversationListContext
  );
  const [loading, setLoading] = useState(false);
  const deleteConversation = async (conversationId) => {
    setLoading(true);
    try {
      const res = await fetch(`${APIEndpoints.CONVERSATION}/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId }),
      });
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }
      toast.success("Chatroom deleted successfully");
      setConversationListChanged(!conversationListChanged);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, deleteConversation };
};

export default useDeleteConversation;
