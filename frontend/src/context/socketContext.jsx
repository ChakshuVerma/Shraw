import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./authContext";
import useChat from "@/zustand/useChat";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

// eslint-disable-next-line react/prop-types
export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { authUser } = useAuthContext();
  const { selectedChat } = useChat();

  const connectionURL = "http://localhost:5000";

  useEffect(() => {
    if (!authUser || !selectedChat) return;
    let newSocket = null;

    // Disconnect existing socket
    if (socket) {
      socket.disconnect();
    }

    newSocket = io(connectionURL, {
      query: {
        userId: authUser._id,
        conversationId: selectedChat?._id || "",
      },
      // Add reconnection settings
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      console.log("Socket connected", newSocket.id);
      setSocket(newSocket);
    });

    // Online users tracking
    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    newSocket.on("disconnect", (reason) => {
      console.log("Socket disconnected", reason);
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
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
