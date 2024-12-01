import { useState, useEffect } from "react";
import { useDraw } from "../../hooks/useDraw";
import { TwitterPicker } from "react-color";
import useGetMessages from "@/hooks/useGetMessages";
import useListenMessages from "@/hooks/useListenMessages";
import { useSocketContext } from "@/context/socketContext";
import { Spinner } from "@/components/spinner/Spinner";

const CanvasPage = () => {
  const { loading, ctx } = useGetMessages();
  useListenMessages();
  const { socket } = useSocketContext();

  const { canvasRef, onMouseDown, clear, saveImage } = useDraw(drawLine);
  const [color, setColor] = useState("#000");
  const [brushWidth, setBrushWidth] = useState(5);

  function drawLine({ prevPoint, currPoint, canvasCtx }) {
    const { x: currX, y: currY } = currPoint;
    let startPoint = prevPoint ?? currPoint;
    canvasCtx.beginPath();
    canvasCtx.lineWidth = brushWidth;
    canvasCtx.strokeStyle = color;
    canvasCtx.moveTo(startPoint.x, startPoint.y);
    canvasCtx.lineTo(currX, currY);
    canvasCtx.stroke();

    canvasCtx.fillStyle = color;
    canvasCtx.beginPath();
    canvasCtx.arc(currX, currY, brushWidth / 2, 0, Math.PI * 2);
    canvasCtx.fill();
  }

  useEffect(() => {
    const img = new Image();
    img.src = ctx;
    img.onload = () => {
      canvasRef.current
        ?.getContext("2d")
        .drawImage(
          img,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
    };
  }, [ctx, loading, canvasRef]);

  return (
    <>
      {!socket?.connected ? (
        <Spinner />
      ) : (
        <div className="w-screen flex justify-center items-center min-h-screen">
          <div className="flex flex-col items-center h=[90%] border border-black p-3 m-5 space-y-5">
            <TwitterPicker
              triangle="hide"
              width="150px"
              color={color}
              onChange={(e) => setColor(e.hex)}
            />
            <input
              type="range"
              min="1"
              max="30"
              defaultValue={brushWidth}
              onChange={(e) => setBrushWidth(e.target.value)}
            ></input>
            <button
              type="button"
              className="border border-black rounded-md px-4 py-2 bg-blue-500 text-white"
              onClick={clear}
            >
              Clear
            </button>
            <button
              type="button"
              className="border border-black rounded-md px-4 py-2 bg-blue-500 text-white"
              onClick={saveImage}
            >
              Save Image
            </button>
          </div>
          <canvas
            onMouseDown={onMouseDown}
            ref={canvasRef}
            width={1000}
            height={700}
            className="border border-black rounded-md"
          />
        </div>
      )}
    </>
  );
};

export default CanvasPage;
