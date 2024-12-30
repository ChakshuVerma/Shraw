import { APIEndpoints } from "@/constants/constants";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const JoinConversation = () => {
  const [conversationJoined, setConversationJoined] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const joinNewConversation = async () => {
      try {
        const queryParameters = new URLSearchParams(window.location.search);
        const conversationId = queryParameters.get("id");
        const url = window.location.href;

        const res = await fetch(
          `${APIEndpoints.CONVERSATION}/join/${conversationId}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              url,
            }),
          }
        );

        const data = await res.json();

        if (data.error) {
          throw new Error(data.error);
        } else if (data.message) {
          setConversationJoined(true);
          toast.success(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setTimeout(() => {
          toast.success("Redirecting to home page");
        }, 100);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
    };
    joinNewConversation();
  }, []);

  return (
    <>
      <div className="flex w-screen h-screen justify-center items-center text-5xl font-bold">
        {!conversationJoined ? (
          <div>Joining...</div>
        ) : (
          <div>Conversation Joined</div>
        )}
      </div>
    </>
  );
};

export default JoinConversation;
