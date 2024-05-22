import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const useEnterConversation = (conversationId) => {
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [conversationDetails, setConversationDetails] = useState(null);

  useEffect(() => {
    const checkAuthority = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/conversations/check", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            conversationId,
          }),
        });

        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        }
        setConversationDetails(data.conversation);
        setIsAuthorized(true);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };
    checkAuthority();
  }, [conversationId]);

  return { loading, isAuthorized, conversationDetails };
};

export default useEnterConversation;
