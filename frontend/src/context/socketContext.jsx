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
  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:5000", {
        query: {
          userId: authUser._id,
          conversationId: selectedChat?._id,
        },
      });
      setSocket(socket);

      // socket.on can be used on both frontend and backend
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser, selectedChat?._id]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
