const updateCanvas = (canvasCtx, strokes) => {
  if (!canvasCtx || strokes.length === 0) return;
  strokes.forEach((newStroke) => {
    canvasCtx.save();
    canvasCtx.strokeStyle = newStroke.color;
    canvasCtx.lineWidth = newStroke.brushWidth;
    canvasCtx.lineCap = "round";
    canvasCtx.lineJoin = "round";

    canvasCtx.beginPath();
    const points = newStroke.points;
    if (points.length > 0) {
      canvasCtx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) {
        canvasCtx.lineTo(points[i].x, points[i].y);
      }
    }

    canvasCtx.stroke();
    canvasCtx.restore();
  });
};

export default updateCanvas;
