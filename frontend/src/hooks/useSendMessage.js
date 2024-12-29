import { APIEndpoints } from "@/constants/constants";
import useChat from "../zustand/useChat";
import { useState } from "react";
import toast from "react-hot-toast";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { selectedChat } = useChat();

  const sendMessage = async (newStroke) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${APIEndpoints.MESSAGE}/send/${selectedChat._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newStroke }),
        }
      );
      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
      }
    } catch (error) {
      console.error("Error sending message", error);
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = async (canvasRef) => {
    setLoading(true);

    const canvasCtx = canvasRef?.current?.getContext("2d");
    try {
      const response = await fetch(
        `${APIEndpoints.MESSAGE}/clear/${selectedChat._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
      }

      canvasCtx?.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    } catch (error) {
      console.error("Error clearing messages", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessage, clearMessages };
};

export default useSendMessage;
