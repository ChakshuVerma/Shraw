import { useSocketContext } from "@/context/socketContext";
import useChat from "@/zustand/useChat";
import { useEffect } from "react";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { setCtx, ctx } = useChat();

  useEffect(() => {
    socket?.on("newMessage", (message) => {
      setCtx(message);
    });

    return () => socket?.off("newMessage");
  }, [socket, setCtx, ctx]);
};

export default useListenMessages;
