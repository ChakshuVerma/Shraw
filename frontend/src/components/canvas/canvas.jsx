import { useState, useEffect } from "react";
import { useDraw } from "../../hooks/useDraw";
import useGetMessages from "@/hooks/useGetMessages";
import useListenMessages from "@/hooks/useListenMessages";
import { useSocketContext } from "@/context/socketContext";
import useGetOnlineUsers from "@/hooks/useGetOnlineUsers";
import useChat from "@/zustand/useChat";
import { DrawingMethods } from "@/constants/constants";
import { Spinner } from "@/components/spinner/Spinner";
import Tooltip from "../tooltip/Tooltip";
import Toolkit from "./toolkit";

const CanvasPage = () => {
  const { socket } = useSocketContext();
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [color, setColor] = useState("#000");
  const [brushWidth, setBrushWidth] = useState(5);
  const [type, setType] = useState(DrawingMethods.SCRIBBLE);

  const { canvasRef, onMouseDown, clear, saveImage, onMouseMove, onMouseUp } =
    useDraw();
  useGetMessages(isCanvasReady ? canvasRef : null); // Pass canvasRef only when ready
  useListenMessages(isCanvasReady ? canvasRef : null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [colorMap, setColorMap] = useState({});
  useGetOnlineUsers({ onlineUsers, setOnlineUsers, colorMap, setColorMap });
  const { selectedChat } = useChat();

  useEffect(() => {
    const interval = setInterval(() => {
      if (canvasRef.current) {
        setIsCanvasReady(true);
        clearInterval(interval);
      }
    }, 0);

    return () => clearInterval(interval);
  }, [canvasRef]);

  useEffect(() => {}, [onlineUsers, colorMap]);

  const extraStyles = "fixed z-50 bg-opacity-60 bg-black";
  const loadingMessage = "Loading last saved context...";

  const getInitials = (name) => {
    const [firstName, lastName] = name.split(" ");
    const res = `${firstName[0]}${lastName?.[0] || ""}`.toUpperCase();
    return res;
  };

  return (
    <>
      {!socket?.connected || onlineUsers.length === 0 ? (
        <Spinner extraStyles={extraStyles} loadingMessage={loadingMessage} />
      ) : (
        <div className="relative w-full h-full overflow-auto">
          <div className="flex flex-row items-center p-3 space-x-5 fixed top-5 left-5 rounded-md bg-indigo-100 text-3xl font-bold">
            <span>{selectedChat.name}</span>
          </div>
          <div className="flex flex-row items-center p-3 space-x-5 fixed top-5 right-10 rounded-md text-3xl font-bold cursor-pointer">
            <div className="flex -space-x-4 rtl:space-x-reverse">
              {onlineUsers.map((onlineUser) => (
                <Tooltip
                  message={`${onlineUser.name} ${
                    onlineUser.socketId === socket.id ? " (You)" : " "
                  }`}
                  key={onlineUser.socketId}
                >
                  <div
                    className="w-10 h-10 border-2 border-black rounded-full dark:border-gray-800 text-sm flex items-center 
                 text-center text-white pl-2 group-hover:scale-110 transition-all duration-200 group-hover:border-3 "
                    style={{ backgroundColor: colorMap[onlineUser.socketId] }}
                  >
                    {getInitials(onlineUser.name)}
                  </div>
                </Tooltip>
              ))}
            </div>
          </div>
          <Toolkit
            clear={clear}
            saveImage={saveImage}
            color={color}
            setColor={setColor}
            brushWidth={brushWidth}
            setBrushWidth={setBrushWidth}
            type={type}
            setType={setType}
          />
          <canvas
            className="cursor-crosshair"
            onMouseDown={(e) => onMouseDown(e, color, brushWidth, type)}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            ref={canvasRef}
            width={3000}
            height={2000}
          />
        </div>
      )}
    </>
  );
};

export default CanvasPage;
