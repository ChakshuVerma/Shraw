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
} from "lucide-react";
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
  const colorPallete = "color";
  const brushWidthRange = "brushWidth";

  useEffect(() => {
    setPickerType(type);
  }, [type]);

  const changePickerType = (type) => {
    setPickerType((prev) => {
      return prev === type ? null : type;
    });
  };

  return (
    <div className="flex flex-col items-center border p-3 space-y-5 fixed top-[50%] translate-y-[-50%] left-[10px] bg-indigo-100 rounded-md">
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
              <CirclePicker color={color} onChange={(e) => setColor(e.hex)} />
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
            return prev === DrawingMethods.LINE ? null : DrawingMethods.LINE;
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
  );
};

export default Toolkit;
