import toast from "react-hot-toast";
import { useEffect } from "react";
import useChat from "../zustand/useChat";
import updateCanvas from "@/utils/updateCanvas";

const useGetMessages = (canvasRef) => {
  const { selectedChat } = useChat();
  const canvasCtx = canvasRef?.current.getContext("2d");
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch(`/api/messages/${selectedChat._id}`);
        const data = await res.json();
        if (data.err) {
          toast.error(data.err);
        }
        updateCanvas(canvasCtx, data);
      } catch (err) {
        toast.error(err.message);
      }
    };

    if (selectedChat?._id) getMessages();
  }, [selectedChat?._id, canvasRef, canvasCtx]);
};

export default useGetMessages;
