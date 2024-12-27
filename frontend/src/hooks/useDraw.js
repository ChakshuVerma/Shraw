import { useEffect, useRef, useState } from "react";
import useSendMessage from "@/hooks/useSendMessage";
import rough from "roughjs/bundled/rough.esm";

export const useDraw = () => {
  const { sendMessage, clearMessages } = useSendMessage();
  const canvasRef = useRef(null);
  const prevPoint = useRef(null);
  const [currStroke, setCurrStroke] = useState({});
  const [mouseDown, setMouseDown] = useState(false);
  // const generator = rough.generator();

  const onMouseDown = (color, brushWidth, type) => {
    setCurrStroke({
      points: [],
      color,
      brushWidth,
      type,
    });
    setMouseDown(true);
  };

  const scribbleLine = ({ previousPoint, currentPoint }) => {
    if (!canvasRef?.current || !currentPoint || !mouseDown) return;
    // currStroke.current?.points.push(currentPoint);
    setCurrStroke((prev) => ({
      ...prev,
      points: [...prev.points, currentPoint],
    }));
    const canvasCtx = canvasRef?.current.getContext("2d");
    const roughCanvas = rough.canvas(canvasCtx.canvas);

    let startPoint = previousPoint ?? currentPoint;
    roughCanvas.line(
      startPoint.x,
      startPoint.y,
      currentPoint.x,
      currentPoint.y,
      {
        stroke: currStroke.color,
        strokeWidth: currStroke.brushWidth,
      }
    );
    prevPoint.current = currentPoint;
  };

  const straightLine = ({ currentPoint }) => {
    if (!canvasRef?.current || !currentPoint || !mouseDown) return;
    if (currStroke.points.length === 0) {
      setCurrStroke((prev) => ({
        ...prev,
        points: [currentPoint, currentPoint],
      }));
    } else {
      setCurrStroke((prev) => ({
        ...prev,
        points: [prev.points[0], currentPoint],
      }));
    }
    const canvasCtx = canvasRef?.current.getContext("2d");
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
    const roughCanvas = rough.canvas(canvasCtx.canvas);
    if (currStroke.points.length < 2) return;
    roughCanvas.line(
      currStroke.points[0].x,
      currStroke.points[0].y,
      currStroke.points[1].x,
      currStroke.points[1].y,
      {
        stroke: currStroke.color,
        strokeWidth: currStroke.brushWidth,
      }
    );
  };

  const rectangle = ({ currentPoint }) => {
    if (!canvasRef?.current || !currentPoint || !mouseDown) return;
    if (currStroke.points.length === 0) {
      setCurrStroke((prev) => ({
        ...prev,
        points: [currentPoint, currentPoint],
      }));
    } else {
      setCurrStroke((prev) => ({
        ...prev,
        points: [prev.points[0], currentPoint],
      }));
    }
    const canvasCtx = canvasRef?.current.getContext("2d");
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
    const roughCanvas = rough.canvas(canvasCtx.canvas);
    if (currStroke.points.length < 2) return;
    const width = currStroke.points[1].x - currStroke.points[0].x;
    const height = currStroke.points[1].y - currStroke.points[0].y;
    roughCanvas.rectangle(
      currStroke.points[0].x,
      currStroke.points[0].y,
      width,
      height,
      {
        stroke: currStroke.color,
        strokeWidth: currStroke.brushWidth,
        fill: "solid",
      }
    );
  };

  const ellipse = ({ currentPoint }) => {
    if (!canvasRef?.current || !currentPoint || !mouseDown) return;
    if (currStroke.points.length === 0) {
      setCurrStroke((prev) => ({
        ...prev,
        points: [currentPoint, currentPoint],
      }));
    } else {
      setCurrStroke((prev) => ({
        ...prev,
        points: [prev.points[0], currentPoint],
      }));
    }
    const canvasCtx = canvasRef?.current.getContext("2d");
    canvasCtx.clearRect(0, 0, canvasCtx.canvas.width, canvasCtx.canvas.height);
    const roughCanvas = rough.canvas(canvasCtx.canvas);
    if (currStroke.points.length < 2) return;
    const centerX = (currStroke.points[0].x + currStroke.points[1].x) / 2;
    const centerY = (currStroke.points[0].y + currStroke.points[1].y) / 2;
    const height = Math.abs(currStroke.points[1].y - currStroke.points[0].y);
    const width = Math.abs(currStroke.points[1].x - currStroke.points[0].x);
    roughCanvas.ellipse(centerX, centerY, width, height, {
      stroke: currStroke.color,
      strokeWidth: currStroke.brushWidth,
      fill: "solid",
    });
  };

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
      switch (currStroke.type) {
        case "scribble":
          scribbleLine({ previousPoint: prevPoint.current, currentPoint });
          break;
        case "line":
          straightLine({ currentPoint });
          break;
        case "rectangle":
          rectangle({ currentPoint });
          break;
        case "ellipse":
          ellipse({ currentPoint });
          break;
        default:
          break;
      }
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
      if (currStroke.points.length > 0) sendMessage(currStroke);
      setCurrStroke({});
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
  }, [mouseDown, currStroke]);

  return { canvasRef, onMouseDown, clear, saveImage };
};
