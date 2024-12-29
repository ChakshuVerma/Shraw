import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./authContext";
import updateOnlineUsersColorMap from "@/utils/updateOnlineUsersColorMap";
import useChat from "@/zustand/useChat";
import io from "socket.io-client";
import { APIEndpoints } from "@/constants/constants";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

// eslint-disable-next-line react/prop-types
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { authUser } = useAuthContext();
  const { selectedChat, setOnlineUsers, setOnlineUserColorMap, colorMap } =
    useChat();

  useEffect(() => {
    if (!authUser || !selectedChat) return;
    let newSocket = null;

    // Disconnect existing socket
    if (socket) {
      socket.disconnect();
    }

    newSocket = io(APIEndpoints.SOCKET_SERVER, {
      query: {
        userId: authUser._id,
        name: authUser.name,
        conversationId: selectedChat?._id || "",
      },
      // Add reconnection settings
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // ? Logging
    newSocket.on("connect", () => {
      setSocket(newSocket);
    });

    newSocket.on("getOnlineUsers", (usersList) => {
      setOnlineUsers(usersList);
      setOnlineUserColorMap(updateOnlineUsersColorMap({ colorMap, usersList }));
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    // Cleanup function
    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [authUser?._id, selectedChat?._id]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
