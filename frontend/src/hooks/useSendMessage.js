import useChat from "../zustand/useChat";
import { useState } from "react";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { setCtx, selectedChat } = useChat();

  const sendMessage = async (newCtx) => {
    console.log(newCtx);
    setLoading(true);
    try {
      const response = await fetch(`/api/messages/send/${selectedChat._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newCtx }),
      });
      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
      }
      setCtx(newCtx);
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessage };
};

export default useSendMessage;
