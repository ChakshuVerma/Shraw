import { useSocketContext } from "@/context/socketContext";
import { useEffect } from "react";
import updateCanvas from "@/utils/updateCanvas";

const useListenMessages = (canvasRef) => {
  const { socket } = useSocketContext();
  const canvasCtx = canvasRef?.current?.getContext("2d");
  useEffect(() => {
    socket?.on("newMessage", (newStroke) => {
      updateCanvas(canvasRef, [newStroke]);
    });
    socket?.on("clearCanvas", () => {
      canvasCtx?.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    });
    return () => {
      socket?.off("newMessage");
      socket?.off("clearCanvas");
    };
  }, [socket, canvasCtx, canvasRef]);
};

export default useListenMessages;
