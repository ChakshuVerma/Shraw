import { useState } from "react";
import toast from "react-hot-toast";
import { APIEndpoints } from "@/constants/constants";

const useAddMembersToConversation = () => {
  const [loading, setLoading] = useState(false);

  const addMember = async ({ memberEmail, conversationId }) => {
    memberEmail = memberEmail.trim();
    const isValid = handleInputErrors(memberEmail);
    if (!isValid) return;

    const sendActualInvitation = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${APIEndpoints.CONVERSATION}/add/${conversationId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ memberEmail }),
          }
        );
        const data = await res.json();

        if (data.error) {
          throw new Error(data.error); // Reject with the error message
        }
        return data; // Resolve with the response data
      } finally {
        setLoading(false);
      }
    };

    try {
      // Handle async operation with toast.promise
      await toast.promise(sendActualInvitation(), {
        loading: "Sending invitation...",
        success: (data) => data.message,
        error: (err) => err.message,
      });
    } catch (err) {
      //
    }
  };

  return { loading, addMember };
};

const handleInputErrors = (email) => {
  if (!email) {
    toast.error("Please enter a non-empty email");
    return false;
  }
  // Simple regex for email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    toast.error("Please enter a valid email address");
    return false;
  }
  return true;
};

export default useAddMembersToConversation;
