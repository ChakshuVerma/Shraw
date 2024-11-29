import toast from "react-hot-toast";
import { useState } from "react";
const useDeleteConversation = () => {
  const [loading, setLoading] = useState(false);
  const deleteConversation = async (conversationId) => {
    setLoading(true);
    try {
      const res = await fetch("/api/conversations/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId }),
      });
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }
      toast.success("Chatroom deleted successfully");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, deleteConversation };
};

export default useDeleteConversation;
