import { useSocketContext } from "@/context/socketContext";
import { useEffect } from "react";
import getRandomDarkColor from "@/utils/getRandomDarkColor";
const useGetOnlineUsers = ({
  onlineUsers,
  setOnlineUsers,
  colorMap,
  setColorMap,
}) => {
  const { socket } = useSocketContext();
  useEffect(() => {
    socket?.on("getOnlineUsers", (usersList) => {
      updateColorMap({ colorMap, setColorMap, usersList });
      setOnlineUsers(usersList);
    });

    return () => socket?.off("getOnlineUsers");
  }, [socket, setOnlineUsers, colorMap, setColorMap, onlineUsers]);

  return onlineUsers;
};

const updateColorMap = ({ colorMap, setColorMap, usersList }) => {
  let tempColorMap = colorMap;
  usersList.forEach((user) => {
    if (!tempColorMap[user.socketId]) {
      tempColorMap[user.socketId] = getRandomDarkColor();
    }
  });
  const onlineSocketIds = new Set(usersList.map((user) => user.socketId));
  Object.keys(tempColorMap).forEach((socketId) => {
    if (!onlineSocketIds.has(socketId)) {
      delete tempColorMap[socketId];
    }
  });
  setColorMap(tempColorMap);
};

export default useGetOnlineUsers;
