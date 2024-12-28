import { useState, useEffect } from "react";
import { useDraw } from "../../hooks/useDraw";
import { CirclePicker } from "react-color";
import useGetMessages from "@/hooks/useGetMessages";
import useListenMessages from "@/hooks/useListenMessages";
import { useSocketContext } from "@/context/socketContext";
import {
  Brush,
  Pencil,
  RectangleHorizontal,
  Circle,
  Download,
  ListRestart,
  Palette,
  SlidersHorizontal,
} from "lucide-react";
import { DrawingMethods } from "@/constants/constants";
import { Spinner } from "@/components/spinner/Spinner";

const CanvasPage = () => {
  const { socket } = useSocketContext();
  const [isCanvasReady, setIsCanvasReady] = useState(false);
  const [color, setColor] = useState("#000");
  const [brushWidth, setBrushWidth] = useState(5);
  const [type, setType] = useState(DrawingMethods.SCRIBBLE);

  const { canvasRef, onMouseDown, clear, saveImage, onMouseMove, onMouseUp } =
    useDraw();
  useGetMessages(isCanvasReady ? canvasRef : null); // Pass canvasRef only when ready
  useListenMessages(isCanvasReady ? canvasRef : null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (canvasRef.current) {
        setIsCanvasReady(true);
        clearInterval(interval);
      }
    }, 0);

    return () => clearInterval(interval);
  }, [canvasRef]);

  const extraStyles = "fixed z-50 bg-opacity-60 bg-black";
  const loadingMessage = "Loading last saved context...";

  return (
    <>
      {!socket?.connected ? (
        <Spinner extraStyles={extraStyles} loadingMessage={loadingMessage} />
      ) : (
        <div className="relative w-full h-full overflow-auto">
          <div className="flex flex-col items-center border p-3 space-y-5 fixed top-[50%] translate-y-[-50%] left-[10px] bg-indigo-100 rounded-md">
            <div className="relative group cursor-pointer">
              <Palette size={30} style={{ strokeWidth: 3, color }} />
              <div className="absolute p-2 bg-transparent top-0 left-0 pl-12 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
                <div className="bg-indigo-100 p-5 rounded-2xl ">
                  <CirclePicker
                    color={color}
                    onChange={(e) => setColor(e.hex)}
                  />
                </div>
              </div>
            </div>
            <div className="relative group cursor-pointer">
              <SlidersHorizontal size={30} style={{ strokeWidth: 3 }} />
              <div className="absolute p-2 bg-transparent top-0 left-0 pl-12 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity">
                <div className="bg-indigo-100 p-2 rounded-2xl">
                  <input
                    type="range"
                    min="1"
                    max="30"
                    defaultValue={brushWidth}
                    onChange={(e) => setBrushWidth(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <button onClick={() => setType(DrawingMethods.SCRIBBLE)}>
              <div className="cursor-pointer active:scale-50 active:shadow-xl active:bg-gray-200 transition-all duration-200">
                <Brush
                  size={24}
                  style={{
                    strokeWidth: 3,
                    color: type === DrawingMethods.SCRIBBLE ? color : "black",
                    fill: type === DrawingMethods.SCRIBBLE && color,
                  }}
                />
              </div>
            </button>
            <button onClick={() => setType(DrawingMethods.LINE)}>
              <div className="cursor-pointer active:scale-50 active:shadow-xl active:bg-gray-200 transition-all duration-200">
                <Pencil
                  size={24}
                  style={{
                    strokeWidth: 3,
                    color: type === DrawingMethods.LINE ? color : "black",
                    fill: type === DrawingMethods.LINE && color,
                  }}
                />
              </div>
            </button>
            <button onClick={() => setType(DrawingMethods.RECTANGLE)}>
              <div className="cursor-pointer active:scale-50 active:shadow-xl active:bg-gray-200 transition-all duration-200 ">
                <RectangleHorizontal
                  size={24}
                  style={{
                    strokeWidth: 3,
                    color: type === DrawingMethods.RECTANGLE ? color : "black",
                    fill: type === DrawingMethods.RECTANGLE && color,
                  }}
                />
              </div>
            </button>
            <button onClick={() => setType(DrawingMethods.ELLIPSE)}>
              <div className="cursor-pointer active:scale-50 active:shadow-xl active:bg-gray-200 transition-all duration-200">
                <Circle
                  size={24}
                  style={{
                    strokeWidth: 3,
                    color: type === DrawingMethods.ELLIPSE ? color : "black",
                    fill: type === DrawingMethods.ELLIPSE && color,
                  }}
                />
              </div>
            </button>
            <button type="button" onClick={clear}>
              <div className="cursor-pointer active:scale-50 active:shadow-xl active:bg-gray-200 transition-all duration-200">
                <ListRestart size={24} style={{ strokeWidth: 3 }} />
              </div>
            </button>
            <button type="button" onClick={saveImage}>
              <div className="cursor-pointer active:scale-50 active:shadow-xl active:bg-gray-200 transition-all duration-200">
                <Download size={24} style={{ strokeWidth: 3 }} />
              </div>
            </button>
          </div>
          <canvas
            className="cursor-crosshair"
            onMouseDown={(e) => onMouseDown(e, color, brushWidth, type)}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            ref={canvasRef}
            width={3000}
            height={2000}
          />
        </div>
      )}
    </>
  );
};

export default CanvasPage;
