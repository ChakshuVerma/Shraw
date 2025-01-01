import { useRef, useState, useCallback } from "react";
import useSendMessage from "@/hooks/useSendMessage";
import rough from "roughjs/bundled/rough.esm";
import { DrawingMethods, ShapeFill } from "@/constants/constants";

export const useDraw = () => {
  const { sendMessage, clearMessages } = useSendMessage();
  const canvasRef = useRef(null);
  const prevPoint = useRef(null);
  const roughCanvasRef = useRef(null);
  const savedImageRef = useRef(null);
  const [startPos, setStartPos] = useState({});
  const [currStroke, setCurrStroke] = useState({});
  const [mouseDown, setMouseDown] = useState(false);

  const computePointsInCanvas = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;

    if (e.touches) {
      const touch = e.touches[0];
      x = touch.clientX - rect.left;
      y = touch.clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }
    return { x, y };
  }, []);

  const initializeCanvas = useCallback((color, brushWidth, type) => {
    if (!canvasRef?.current) return;
    const canvas = canvasRef.current;
    roughCanvasRef.current ??= rough.canvas(canvas);

    if (!savedImageRef.current) {
      savedImageRef.current = document.createElement("canvas");
      savedImageRef.current.width = canvas.width;
      savedImageRef.current.height = canvas.height;
    }

    const savedCtx = savedImageRef.current.getContext("2d");
    savedCtx.clearRect(0, 0, canvas.width, canvas.height);
    savedCtx.drawImage(canvas, 0, 0);

    setCurrStroke({
      points: [],
      color,
      brushWidth,
      type,
    });
    setMouseDown(true);
  }, []);

  const onMouseDown = useCallback(
    (event, color, brushWidth, type) => {
      initializeCanvas(color, brushWidth, type);
      const initPoint = computePointsInCanvas(event);
      setStartPos(initPoint);
      prevPoint.current = initPoint;
    },
    [initializeCanvas, computePointsInCanvas]
  );

  const scribbleLine = ({ previousPoint, currentPoint }) => {
    const roughCanvas = roughCanvasRef.current;

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
    setCurrStroke((prev) => ({
      ...prev,
      points: [...prev.points, currentPoint],
    }));
  };

  const redrawOnRoughCanvas = () => {
    const roughCanvas = roughCanvasRef.current;
    const roughCanvasCtx = roughCanvas.canvas.getContext("2d");
    roughCanvasCtx.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    roughCanvasCtx.drawImage(savedImageRef.current, 0, 0);
  };

  const drawStraightLine = ({ currentPoint }) => {
    redrawOnRoughCanvas();
    roughCanvasRef.current.line(
      startPos.x,
      startPos.y,
      currentPoint.x,
      currentPoint.y,
      {
        stroke: currStroke.color,
        strokeWidth: currStroke.brushWidth,
      }
    );
    setCurrStroke((prev) => ({
      ...prev,
      points: [startPos, currentPoint],
    }));
  };

  const drawRectangle = ({ currentPoint }) => {
    redrawOnRoughCanvas();
    roughCanvasRef.current.rectangle(
      startPos.x,
      startPos.y,
      currentPoint.x - startPos.x,
      currentPoint.y - startPos.y,
      {
        stroke: "#000",
        strokeWidth: currStroke.brushWidth,
        fill: currStroke.color,
        roughness: 0,
        fillStyle: ShapeFill.SOLID,
      }
    );
    setCurrStroke((prev) => ({
      ...prev,
      points: [startPos, currentPoint],
    }));
  };

  const drawEllipse = ({ currentPoint }) => {
    redrawOnRoughCanvas();

    const centerX = (startPos.x + currentPoint.x) / 2;
    const centerY = (startPos.y + currentPoint.y) / 2;
    const height = Math.abs(currentPoint.y - startPos.y);
    const width = Math.abs(currentPoint.x - startPos.x);

    roughCanvasRef.current.ellipse(centerX, centerY, width, height, {
      stroke: "#000",
      strokeWidth: currStroke.brushWidth,
      fill: currStroke.color,
      roughness: 0,
      fillStyle: ShapeFill.SOLID,
    });
    setCurrStroke((prev) => ({
      ...prev,
      points: [startPos, currentPoint],
    }));
  };

  const clear = useCallback(() => {
    clearMessages(canvasRef);
  }, [clearMessages]);

  const onMouseMove = useCallback(
    (e) => {
      if (!mouseDown) return;
      const currentPoint = computePointsInCanvas(e);
      switch (currStroke.type) {
        case DrawingMethods.SCRIBBLE:
          scribbleLine({ previousPoint: prevPoint.current, currentPoint });
          break;
        case DrawingMethods.LINE:
          drawStraightLine({ currentPoint });
          break;
        case DrawingMethods.RECTANGLE:
          drawRectangle({ currentPoint });
          break;
        case DrawingMethods.ELLIPSE:
          drawEllipse({ currentPoint });
          break;
        default:
          break;
      }
    },
    [mouseDown, currStroke.type]
  );

  const onMouseUp = useCallback(() => {
    if (!currStroke?.points) return;
    setMouseDown(false);
    prevPoint.current = null;
    if (currStroke.points.length > 0) sendMessage(currStroke);
    setCurrStroke({});
  }, [currStroke, sendMessage]);

  const saveImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`; // passing current date as link download value
    link.href = canvas.toDataURL(); // passing canvasData as link href value
    link.click(); // clicking link to download image
  };

  const onTouchStart = useCallback(
    (e, color, brushWidth, type) => {
      onMouseDown(e, color, brushWidth, type);
    },
    [onMouseDown]
  );

  const onTouchMove = useCallback(
    (e) => {
      onMouseMove(e);
    },
    [onMouseMove]
  );

  const onTouchEnd = useCallback(() => {
    onMouseUp();
  }, [onMouseUp]);

  const setupTouchEvents = useCallback((element, type) => {
    if (type === null) {
      // Make canvas scrollable
      element.style.touchAction = "auto";
      element.style.overscrollBehavior = "auto";
    } else {
      // Make canvas non-scrollable
      element.style.touchAction = "none";
      element.style.overscrollBehavior = "none";
    }
  }, []);

  // Helper method to attach touch events to canvas
  const attachTouchEvents = useCallback(
    (canvasElement, type) => {
      if (canvasElement) {
        setupTouchEvents(canvasElement, type);
      }
    },
    [setupTouchEvents]
  );

  return {
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
  };
};
