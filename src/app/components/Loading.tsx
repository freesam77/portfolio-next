import React, { useEffect, useState } from "react";

const ROWS = 7;
const TEXT = "Loading";
const FALL_DELAY_MS = 45;
const LOOP_DELAY_MS = 2000;

// 5x7 pixel font
const CHAR_MAP: Record<string, string[]> = {
  L: ["1....", "1....", "1....", "1....", "1....", "1....", "11111"],
  O: [".111.", "1...1", "1...1", "1...1", "1...1", "1...1", ".111."],
  A: [".111.", "1...1", "1...1", "11111", "1...1", "1...1", "1...1"],
  D: ["1111.", "1...1", "1...1", "1...1", "1...1", "1...1", "1111."],
  I: ["111", ".1.", ".1.", ".1.", ".1.", ".1.", "111"],
  N: ["1...1", "11..1", "1.1.1", "1..11", "1...1", "1...1", "1...1"],
  G: [".111.", "1...1", "1....", "1.111", "1...1", "1...1", ".111."],
};

// Converts text to a grid of booleans
const buildPixelGrid = (text: string): boolean[][] => {
  const grid: boolean[][] = Array.from({ length: ROWS }, () => []);
  const chars = text.toUpperCase().split("");

  for (const char of chars) {
    const charMap = CHAR_MAP[char] || CHAR_MAP["."];
    for (let row = 0; row < ROWS; row++) {
      grid[row].push(...charMap[row].split("").map((c) => c === "1"));
      grid[row].push(false); // spacing between characters
    }
  }

  return grid;
};

interface PixelProps {
  isVisible: boolean;
  delay: number;
  pixelSize: number;
}

const Pixel: React.FC<PixelProps> = ({ isVisible, delay, pixelSize }) => {
  return (
    <div
      style={{
        width: pixelSize,
        height: pixelSize,
        backgroundColor: isVisible ? "white" : "transparent",
        transform: isVisible
          ? "translateY(0)"
          : `translateY(-${pixelSize * 8}px)`,
        opacity: isVisible ? 1 : 0,
        transition: `transform 0.5s ease-in-out, opacity 0.5s ease-in-out`,
        transitionDelay: `${delay}ms`,
      }}
    />
  );
};

const PixelatedLoading: React.FC = () => {
  const grid = buildPixelGrid(TEXT);
  const [visible, setVisible] = useState(false);
  const [key, setKey] = useState(0);
  const [pixelSize, setPixelSize] = useState(12);

  useEffect(() => {
    const updatePixelSize = () => {
      const maxCols = grid[0].length;
      const maxUsableWidth = 300;
      const newPixelSize = Math.floor(maxUsableWidth / maxCols);
      setPixelSize(newPixelSize);
    };

    updatePixelSize();
    window.addEventListener("resize", updatePixelSize);
    return () => window.removeEventListener("resize", updatePixelSize);
  }, [grid]);

  useEffect(() => {
    setVisible(true);
    const totalDuration =
      grid[0].length * FALL_DELAY_MS + ROWS * 30 + LOOP_DELAY_MS;

    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => setKey((k) => k + 1), 500);
    }, totalDuration);

    return () => clearTimeout(timer);
  }, [key]);

  return (
    <div className="h-screen flex items-center justify-center">
      <div
        key={key}
        style={{
          display: "grid",
          gridTemplateRows: `repeat(${ROWS}, ${pixelSize}px)`,
          gridTemplateColumns: `repeat(${grid[0].length}, ${pixelSize}px)`,
          gap: `${Math.max(1, Math.floor(pixelSize / 6))}px`,
        }}
      >
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const delay = colIndex * FALL_DELAY_MS + rowIndex * 25;
            return (
              <Pixel
                key={`${rowIndex}-${colIndex}`}
                isVisible={visible && cell}
                delay={delay}
                pixelSize={pixelSize}
              />
            );
          }),
        )}
      </div>
    </div>
  );
};

export default PixelatedLoading;
