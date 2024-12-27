import { useState, useEffect } from "react";
import { useDraw } from "../../hooks/useDraw";
import { TwitterPicker } from "react-color";
import useGetMessages from "@/hooks/useGetMessages";
import useListenMessages from "@/hooks/useListenMessages";
import { useSocketContext } from "@/context/socketContext";
import { Spinner } from "@/components/spinner/Spinner";

const CanvasPage = () => {
  const { socket } = useSocketContext();
  const [isCanvasReady, setIsCanvasReady] = useState(false);

  const { canvasRef, onMouseDown, clear, saveImage } = useDraw();
  useGetMessages(isCanvasReady ? canvasRef : null); // Pass canvasRef only when ready
  useListenMessages(isCanvasReady ? canvasRef : null);
  const [color, setColor] = useState("#000");
  const [brushWidth, setBrushWidth] = useState(5);

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
          <div className="flex flex-col items-center border border-black p-3 space-y-5 fixed top-[50%] translate-y-[-50%] left-[10px] bg-black">
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
            onMouseDown={() => onMouseDown(color, brushWidth)}
            ref={canvasRef}
            width={3000}
            height={2000}
            className=" bg-gray-200"
          />
        </div>
      )}
    </>
  );
};

export default CanvasPage;
