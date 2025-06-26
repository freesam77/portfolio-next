"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { LikeItem } from "../types";
import SectionLoading from "./SectionLoading";
import ErrorComponent from "./ErrorComponent";

interface LikesProps {
  delay?: number;
}

const Likes: React.FC<LikesProps> = ({ delay = 3000 }) => {
  const [data, setData] = useState<LikeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState({ title: "", tagline: "" });
  const [showCursor, setShowCursor] = useState(true);
  const [activeLine, setActiveLine] = useState<"title" | "tagline">("title");
  const timeoutRef = useRef<NodeJS.Timeout>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/notion/likes");
        if (!response.ok) throw new Error("Failed to fetch likes data");
        const result = await response.json();
        setData(result.likes ?? []);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unknown error");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Filter out empty items
  const items = useMemo(
    () => data.filter((item) => item.likes.trim() !== ""),
    [data],
  );

  useEffect(() => {
    if (items.length === 0) return;

    const currentItem = items[currentIndex % items.length];
    if (!currentItem) return;

    let titleIndex = -1;
    let taglineIndex = -1;

    setDisplayText({ title: "", tagline: "" });
    setActiveLine("title");

    const typeTitle = () => {
      if (titleIndex < currentItem.likes.length - 1) {
        setDisplayText((prev) => ({
          ...prev,
          title: prev.title + currentItem.likes[titleIndex],
        }));
        titleIndex++;
        timeoutRef.current = setTimeout(typeTitle, 50 + Math.random() * 50);
      } else {
        if (currentItem.tagline) {
          setActiveLine("tagline");
          timeoutRef.current = setTimeout(typeTagline, 300);
        } else {
          completeTyping();
        }
      }
    };

    const typeTagline = () => {
      if (taglineIndex < currentItem.tagline.length - 1) {
        setDisplayText((prev) => ({
          ...prev,
          tagline: prev.tagline + currentItem.tagline[taglineIndex],
        }));
        taglineIndex++;
        timeoutRef.current = setTimeout(typeTagline, 30 + Math.random() * 50);
      } else {
        completeTyping();
      }
    };

    const completeTyping = () => {
      // Move to next item after delay
      timeoutRef.current = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
      }, delay) as unknown as NodeJS.Timeout;
    };

    typeTitle();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentIndex, delay, items]);

  // Blink cursor effect - always running
  useEffect(() => {
    const interval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <SectionLoading />;
  if (error) return <ErrorComponent error={error} />;
  if (items.length === 0) {
    return <div>No data available</div>;
  }

  return (
    <div className="font-mono bg-gray-900/60 text-gray-100 p-5 rounded-lg max-w-2xl w-[90%] h-[150px] backdrop-blur">
      <div className="text-cyan-400 text-lg mb-2">
        {displayText.title}
        {activeLine === "title" && (
          <span
            className={`inline-block w-2 h-6 bg-gray-100 align-middle ml-1 ${showCursor ? "opacity-100" : "opacity-0"}`}
          />
        )}
      </div>

      {displayText.tagline && (
        <div className="text-blue-300 text-sm mb-4">
          {displayText.tagline}
          {activeLine === "tagline" && (
            <span
              className={`inline-block w-2 h-4 bg-gray-100 align-middle ml-1 ${showCursor ? "opacity-100" : "opacity-0"}`}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default Likes;
