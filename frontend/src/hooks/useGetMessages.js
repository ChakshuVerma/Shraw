import toast from "react-hot-toast";
import { useState, useEffect } from "react";
import useChat from "../zustand/useChat";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { ctx, setCtx, selectedChat } = useChat();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/messages/${selectedChat._id}`);
        const data = await res.json();
        if (data.err) {
          toast.error(data.err);
        }
        // console.log(data);
        setCtx(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedChat?._id) getMessages();
  }, [selectedChat?._id, setCtx, ctx]);

  return { loading, ctx };
};

export default useGetMessages;
