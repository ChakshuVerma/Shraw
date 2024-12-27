import rough from "roughjs/bundled/rough.esm";

const updateCanvas = (canvasRef, strokes) => {
  if (!canvasRef?.current || strokes.length === 0) return;
  const canvasCtx = canvasRef?.current.getContext("2d");
  const roughCanvas = rough.canvas(canvasCtx.canvas);
  strokes.forEach((newStroke) => {
    switch (newStroke.type) {
      case "scribble":
        drawScribble(roughCanvas, newStroke);
        break;
      case "rectangle":
        drawRectange(roughCanvas, newStroke);
        break;
      case "ellipse":
        drawEllipse(roughCanvas, newStroke);
        break;
      case "line":
        drawLine(roughCanvas, newStroke);
        break;
      default:
        break;
    }
  });
};

const drawScribble = (roughCanvas, newStroke) => {
  const points = newStroke.points.map((point) => [point.x, point.y]);
  roughCanvas.linearPath(points, {
    stroke: newStroke.color,
    strokeWidth: newStroke.brushWidth,
  });
};

const drawRectange = (roughCanvas, newStroke) => {
  const x1 = newStroke.points[0].x;
  const y1 = newStroke.points[0].y;
  const x2 = newStroke.points[1].x;
  const y2 = newStroke.points[1].y;
  const length = x2 - x1;
  const width = y2 - y1;
  roughCanvas.rectangle(x1, y1, length, width, {
    stroke: newStroke.color,
    strokeWidth: newStroke.brushWidth,
    fill: "solid",
  });
};

const drawEllipse = (roughCanvas, newStroke) => {
  const x1 = newStroke.points[0].x;
  const y1 = newStroke.points[0].y;
  const x2 = newStroke.points[1].x;
  const y2 = newStroke.points[1].y;
  const centerX = (x1 + x2) / 2;
  const centerY = (y1 + y2) / 2;
  const width = Math.abs(x2 - x1);
  const height = Math.abs(y2 - y1);

  roughCanvas.ellipse(centerX, centerY, width, height, {
    stroke: newStroke.color,
    strokeWidth: newStroke.brushWidth,
    fill: "solid",
  });
};

const drawLine = (roughCanvas, newStroke) => {
  const x1 = newStroke.points[0].x;
  const y1 = newStroke.points[0].y;
  const x2 = newStroke.points[1].x;
  const y2 = newStroke.points[1].y;
  roughCanvas.line(x1, y1, x2, y2, {
    stroke: newStroke.color,
    strokeWidth: newStroke.brushWidth,
  });
};

export default updateCanvas;
