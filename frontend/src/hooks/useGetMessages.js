import toast from "react-hot-toast";
import { useEffect } from "react";
import useChat from "../zustand/useChat";
import updateCanvas from "@/utils/updateCanvas";
import { APIEndpoints } from "@/constants/constants";

const useGetMessages = (canvasRef) => {
  const { selectedChat } = useChat();
  useEffect(() => {
    const getMessages = async () => {
      try {
        const res = await fetch(`${APIEndpoints.MESSAGE}/${selectedChat._id}`);
        const data = await res.json();
        if (data.err) {
          toast.error(data.err);
        }
        updateCanvas(canvasRef, data);
      } catch (err) {
        toast.error(err.message);
      }
    };

    if (selectedChat?._id) getMessages();
  }, [selectedChat?._id, canvasRef]);
};

export default useGetMessages;
