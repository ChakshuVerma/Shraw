import { useSocketContext } from "@/context/socketContext";
import { useEffect, useState } from "react";

const useGetOnlineUsers = (conversationId) => {
  const { socket } = useSocketContext();
  const [onlineUsers, setOnlineUsers] = useState([]);
  useEffect(() => {
    socket?.emit("getRoomOnlineUsers", conversationId); // getRoomOnlineUsers event is emitted to the server
    socket?.on("getOnlineUsers", (usersList) => {
      // getOnlineUsers event is emitted from the server
      setOnlineUsers(usersList);
    });

    return () => socket?.off("getOnlineUsers");
  }, [socket, conversationId]);

  return onlineUsers;
};

export default useGetOnlineUsers;
