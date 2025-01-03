import { useState, useEffect } from "react";
import { useDraw } from "../../hooks/useDraw";
import useGetMessages from "@/hooks/useGetMessages";
import useListenMessages from "@/hooks/useListenMessages";
import { useSocketContext } from "@/context/socketContext";
import useChat from "@/zustand/useChat";
import { Spinner } from "@/components/spinner/Spinner";
import Tooltip from "../tooltip/Tooltip";
import Toolkit from "./toolkit";
import { Link } from "react-router-dom";
import shrawIcon from "../../../public/shraw_icon.png";
const CanvasPage = () => {
  const { socket } = useSocketContext();
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [color, setColor] = useState("#4caf50");
  const [brushWidth, setBrushWidth] = useState(5);
  const [type, setType] = useState(null);

  const {
    canvasRef,
    onMouseDown,
    clear,
    saveImage,
    onMouseMove,
    onMouseUp,
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    attachTouchEvents,
  } = useDraw();
  useGetMessages(isCanvasReady ? canvasRef : null); // Pass canvasRef only when ready
  useListenMessages(isCanvasReady ? canvasRef : null);
  const { selectedChat, onlineUsers, onlineUserColorMap } = useChat();

  useEffect(() => {
    const interval = setInterval(() => {
      if (canvasRef.current) {
        attachTouchEvents(canvasRef.current, type);
        setIsCanvasReady(true);
        clearInterval(interval);
      }
    }, 0);

    return () => clearInterval(interval);
  }, [canvasRef, attachTouchEvents, type]);

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
          <nav className="fixed flex flex-row items-start justify-between w-full flex-wrap pointer-events-none bg-gray-500 bg-opacity-60 backdrop-blur-sm">
            <div className="p-3 flex-grow">
              <Link to="/" className="pointer-events-auto text-3xl">
                <img
                  src={shrawIcon}
                  alt="Shraw Icon"
                  height={30}
                  width={30}
                  className="inline mr-1"
                />
                {"Shraw | "}
              </Link>
              <span>{selectedChat.name}</span>
            </div>
            <div className="flex flex-row items-center space-x-5 rounded-md font-bold cursor-pointer p-3">
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
                      style={{
                        backgroundColor:
                          onlineUserColorMap[onlineUser.socketId],
                      }}
                    >
                      {getInitials(onlineUser.name)}
                    </div>
                  </Tooltip>
                ))}
              </div>
            </div>
          </nav>
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
            onMouseLeave={onMouseUp}
            onTouchStart={(e) => onTouchStart(e, color, brushWidth, type)}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
            ref={canvasRef}
            width={5000}
            height={2000}
            draggable="false"
          />
        </div>
      )}
    </>
  );
};

export default CanvasPage;
