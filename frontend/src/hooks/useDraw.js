import { useEffect, useRef, useState } from "react";
import useSendMessage from "@/hooks/useSendMessage";

export const useDraw = (onDraw) => {
  const { sendMessage } = useSendMessage();
  const canvasRef = useRef(null);
  const prevPoint = useRef(null);
  const [mouseDown, setMouseDown] = useState(false);

  const onMouseDown = () => setMouseDown(true);

  const clear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const base64ImageData = canvas.toDataURL("image/png");
    sendMessage(base64ImageData);
  };

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
  };

  useEffect(() => {
    const handler = (e) => {
      const currentPoint = computePointsInCanvas(e);
      const canvasCtx = canvasRef.current?.getContext("2d");
      if (!canvasCtx || !currentPoint || !mouseDown) return;

      onDraw({
        prevPoint: prevPoint.current,
        currPoint: currentPoint,
        canvasCtx,
      });
      prevPoint.current = currentPoint;
    };

    const computePointsInCanvas = (e) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      return { x, y };
    };

    const mouseUpHandler = () => {
      setMouseDown(false);
      prevPoint.current = null;
      const base64ImageData = canvasRef.current.toDataURL("image/png");
      sendMessage(base64ImageData);
    };
    // Add event listeners
    canvasRef.current?.addEventListener("mousemove", handler);
    window.addEventListener("mouseup", mouseUpHandler);
    // Remove event listeners
    return () => {
      canvasRef.current?.removeEventListener("mousemove", handler);
      window.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [onDraw]);

  return { canvasRef, onMouseDown, clear, saveImage };
};
