import { useState } from "react";
import toast from "react-hot-toast";

const useAddMembersToConversation = () => {
  const [loading, setLoading] = useState(false);

  const addMember = async ({ memberEmail, conversationId }) => {
    memberEmail = memberEmail.trim();
    const success = handleInputErrors(memberEmail);
    if (!success) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/conversations/add/${conversationId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberEmail,
        }),
      });
      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      } else {
        toast.success(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  return { loading, addMember };
};

const handleInputErrors = (email) => {
  if (!email) {
    toast.error("Please enter a non-empty email");
    return false;
  }

  return true;
};

export default useAddMembersToConversation;
