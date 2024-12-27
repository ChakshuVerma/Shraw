import { useEffect, useRef, useState } from "react";
import useSendMessage from "@/hooks/useSendMessage";
import rough from "roughjs/bundled/rough.esm";
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

  function scribbleLine({ prevPoint, currPoint }) {
    if (!canvasRef?.current || !currPoint || !mouseDown) return;
    const canvasCtx = canvasRef?.current.getContext("2d");
    const roughCanvas = rough.canvas(canvasCtx.canvas);

    let startPoint = prevPoint ?? currPoint;
    roughCanvas.line(startPoint.x, startPoint.y, currPoint.x, currPoint.y, {
      stroke: currStroke.current.color,
      strokeWidth: currStroke.current.brushWidth,
    });
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
      scribbleLine({ prevPoint: prevPoint.current, currPoint: currentPoint });
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
