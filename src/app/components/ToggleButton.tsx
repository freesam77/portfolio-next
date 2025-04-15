"use client";
import { useState, useEffect } from "react";
import Tooltip from "./Tooltip.tsx";

const url = "https://fonts.googleapis.com/icon?family=Material+Icons";

type ButtonActiveState = "left" | "right" | null;

const ToggleButton = (
  leftButtonCallback?: () => void,
  rightButtonCallback?: () => void,
) => {
  const [buttonActive, setButtonActive] = useState<ButtonActiveState>(null);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.type = "text/css";
    link.href = url;
    link.id = "google-material-icons";

    if (!document.getElementById("google-material-icons")) {
      document.head.appendChild(link);
    }
  }, []);

  const onClickHandler = (buttonCase: ButtonActiveState) => {
    switch (buttonCase) {
      case "left":
        buttonActive !== "left" && setButtonActive("left");
        leftButtonCallback && leftButtonCallback();
        break;
      default:
        buttonActive !== "right" && setButtonActive("right");
        rightButtonCallback && rightButtonCallback();
        break;
    }
  };

  return (
    <div className="flex">
      <Tooltip description="Carousel View">
        <button
          className={`px-5 py-2.5 border-2 border-gray-300 cursor-pointer bg-white transition-colors duration-300 rounded-l-lg border-r-0 ${
            buttonActive === "left"
              ? "bg-blue-500 text-white border-blue-500"
              : "hover:bg-gray-100"
          }`}
          onClick={() => onClickHandler("left")}
        >
          <span className="material-icons md-24">view_carousel</span>
        </button>
      </Tooltip>

      <Tooltip description="Detailed View">
        <button
          className={`px-5 py-2.5 border-2 border-gray-300 cursor-pointer bg-white transition-colors duration-300 rounded-r-lg ${
            buttonActive === "right"
              ? "bg-blue-500 text-white border-blue-500"
              : "hover:bg-gray-100"
          }`}
          onClick={() => onClickHandler("right")}
        >
          <span className="material-icons md-24">view_day</span>
        </button>
      </Tooltip>
    </div>
  );
};

export default ToggleButton;
