import rough from "roughjs/bundled/rough.esm";

const updateCanvas = (canvasRef, strokes) => {
  if (!canvasRef?.current || strokes.length === 0) return;
  const canvasCtx = canvasRef?.current.getContext("2d");
  const roughCanvas = rough.canvas(canvasCtx.canvas);
  strokes.forEach((newStroke) => {
    const points = newStroke.points.map((point) => [point.x, point.y]);
    roughCanvas.linearPath(points, {
      stroke: newStroke.color,
      strokeWidth: newStroke.brushWidth,
    });
  });
};

export default updateCanvas;
