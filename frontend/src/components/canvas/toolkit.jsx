/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import {
  Brush,
  Pencil,
  RectangleHorizontal,
  Circle,
  Download,
  ListRestart,
  Palette,
  SlidersHorizontal,
  Menu,
} from "lucide-react";
import SmallConfirmModal from "@/components/modals/smallConfirmModal";
import { CirclePicker } from "react-color";
import { DrawingMethods } from "@/constants/constants";

const Toolkit = ({
  clear,
  saveImage,
  color,
  setColor,
  type,
  setType,
  brushWidth,
  setBrushWidth,
}) => {
  const [pickerType, setPickerType] = useState(null);
  const [openHamMenu, setOpenHamMenu] = useState(false);
  const [clearCanvas, setClearCanvas] = useState(false);
  const [openClearCanvasModal, setOpenClearCanvasModal] = useState(false);

  const colorPallete = "color";
  const brushWidthRange = "brushWidth";
  const confirmMessage = `Are you sure you want to clear the canvas?`;
  const yesMessage = "Clear";
  const noMessage = "Cancel";

  useEffect(() => {
    const handleResize = () => {
      const isSmallDevice = window.matchMedia("(min-width: 640px)").matches;
      setOpenHamMenu(isSmallDevice);
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setPickerType(type);
    setOpenClearCanvasModal(false);
  }, [type]);

  const changePickerType = (type) => {
    setPickerType((prev) => {
      return prev === type ? null : type;
    });
  };

  const toggleHamMenu = () => {
    setOpenHamMenu((prev) => !prev);
    setOpenClearCanvasModal(false);
  };

  useEffect(() => {
    if (clearCanvas) {
      clear();
      setClearCanvas(false);
    }
  }, [clearCanvas, clear]);

  return (
    <>
      <div className="flex flex-col items-center py-1 px-1 sm:py-5 sm:px-1.5 fixed bg-gray-300 rounded-2xl top-32 left-1 sm:top-[60%] sm:translate-y-[-50%] sm:left-[10px] bg-opacity-60 backdrop-blur-sm">
        <div className="p-2 cursor-pointer sm:hidden" onClick={toggleHamMenu}>
          <Menu size={30} style={{ strokeWidth: 3 }} />
        </div>
        {openHamMenu && (
          <div className="flex-col items-center space-y-5 flex">
            <div className="relative">
              <div
                className="cursor-pointer"
                onClick={() => changePickerType(colorPallete)}
              >
                <Palette size={30} style={{ strokeWidth: 3, color }} />
              </div>
              {pickerType === colorPallete && (
                <div className="absolute p-2 bg-transparent top-0 left-10 opacity-100 pointer-events-auto transition-opacity">
                  <div className="bg-indigo-100 p-5 rounded-2xl">
                    <CirclePicker
                      color={color}
                      onChange={(e) => setColor(e.hex)}
                    />
                  </div>
                </div>
              )}
            </div>
            <div className="relative">
              <div
                className="cursor-pointer"
                onClick={() => changePickerType(brushWidthRange)}
              >
                <SlidersHorizontal size={30} style={{ strokeWidth: 3 }} />
              </div>
              {pickerType === brushWidthRange && (
                <div className="absolute p-2 bg-transparent top-0 left-10 opacity-100 pointer-events-auto transition-opacity">
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
              )}
            </div>
            <button
              onClick={() =>
                setType((prev) => {
                  return prev === DrawingMethods.SCRIBBLE
                    ? null
                    : DrawingMethods.SCRIBBLE;
                })
              }
            >
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
            <button
              onClick={() =>
                setType((prev) => {
                  return prev === DrawingMethods.LINE
                    ? null
                    : DrawingMethods.LINE;
                })
              }
            >
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
            <button
              onClick={() =>
                setType((prev) => {
                  return prev === DrawingMethods.RECTANGLE
                    ? null
                    : DrawingMethods.RECTANGLE;
                })
              }
            >
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
            <button
              onClick={() =>
                setType((prev) => {
                  return prev === DrawingMethods.ELLIPSE
                    ? null
                    : DrawingMethods.ELLIPSE;
                })
              }
            >
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
            <SmallConfirmModal
              setResponse={setClearCanvas}
              confirmMessage={confirmMessage}
              yesMessage={yesMessage}
              noMessage={noMessage}
              open={openClearCanvasModal}
              setOpen={setOpenClearCanvasModal}
            >
              <button type="button">
                <div className="cursor-pointer active:scale-50 active:shadow-xl active:bg-gray-200 transition-all duration-200">
                  <ListRestart
                    size={24}
                    style={{ strokeWidth: 3, color: "red" }}
                  />
                </div>
              </button>
            </SmallConfirmModal>
            <button type="button" onClick={saveImage}>
              <div className="cursor-pointer active:scale-50 active:shadow-xl active:bg-gray-200 transition-all duration-200">
                <Download size={24} style={{ strokeWidth: 3 }} />
              </div>
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default Toolkit;
