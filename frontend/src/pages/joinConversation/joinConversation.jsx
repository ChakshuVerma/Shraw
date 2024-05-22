import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const JoinConversation = () => {
  const [conversationJoined, setConversationJoined] = useState(false);

  useEffect(() => {
    const joinNewConversation = async () => {
      try {
        const queryParameters = new URLSearchParams(window.location.search);
        const conversationId = queryParameters.get("id");
        const url = window.location.href;

        const res = await fetch(`/api/conversations/join/${conversationId}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url,
          }),
        });

        const data = await res.json();
        // console.log(data);
        if (data.error) {
          throw new Error(data.error);
        } else if (data.message) {
          setConversationJoined(true);
          toast.success(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
    joinNewConversation();
  }, []);

  return (
    <>
      {!conversationJoined ? (
        <div>Joining...</div>
      ) : (
        <div>Conversation Joined</div>
      )}
    </>
  );
};

export default JoinConversation;
