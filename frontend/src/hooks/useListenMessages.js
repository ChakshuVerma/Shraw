import { useSocketContext } from "@/context/socketContext";
import useChat from "@/zustand/useChat";
import { useEffect } from "react";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { setCtx, ctx } = useChat();

  useEffect(() => {
    console.log("mesg", socket);
    socket?.on("newMessage", (message) => {
      console.log("message");
      setCtx(message);
    });

    return () => socket?.off("newMessage");
  }, [socket, setCtx, ctx]);
};

export default useListenMessages;
