import { useEffect, useRef, useState } from "react";
import useSendMessage from "@/hooks/useSendMessage";

export const useDraw = () => {
  const { sendMessage, clearMessages } = useSendMessage();
  const canvasRef = useRef(null);
  const prevPoint = useRef(null);
  const currStroke = useRef(null);
  const [mouseDown, setMouseDown] = useState(false);

  const onMouseDown = (color, brushWidth) => {
    currStroke.current = {
      points: [],
      color,
      brushWidth,
    };
    setMouseDown(true);
  };

  function drawLine({ prevPoint, currPoint }) {
    const canvasCtx = canvasRef.current?.getContext("2d");
    if (!canvasCtx || !currPoint || !mouseDown) return;
    const { x: currX, y: currY } = currPoint;
    let startPoint = prevPoint ?? currPoint;
    canvasCtx.beginPath();
    canvasCtx.lineWidth = currStroke.current.brushWidth;
    canvasCtx.strokeStyle = currStroke.current.color;
    canvasCtx.moveTo(startPoint.x, startPoint.y);
    canvasCtx.lineTo(currX, currY);
    canvasCtx.stroke();

    canvasCtx.fillStyle = currStroke.current.color;
    canvasCtx.beginPath();
    canvasCtx.arc(
      currX,
      currY,
      currStroke.current.brushWidth / 2,
      0,
      Math.PI * 2
    );
    canvasCtx.fill();
  }

  const clear = () => {
    clearMessages(canvasRef);
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
      currStroke.current?.points.push(currentPoint);
      drawLine({
        prevPoint: prevPoint.current,
        currPoint: currentPoint,
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
      if (currStroke.current.points.length > 0) sendMessage(currStroke.current);
      currStroke.current = {};
    };
    // Add event listeners
    if (mouseDown) {
      canvasRef.current?.addEventListener("mousemove", handler);
      canvasRef.current?.addEventListener("mouseup", mouseUpHandler);
    }
    // Remove event listeners
    return () => {
      canvasRef.current?.removeEventListener("mousemove", handler);
      canvasRef.current?.removeEventListener("mouseup", mouseUpHandler);
    };
  }, [mouseDown]);

  return { canvasRef, onMouseDown, clear, saveImage };
};
