import React from "react";

// NOTE: This component is currently unused, but is kept for future use because the style is liked by the author.
// You can use this for client-side loading states or future interactive features.

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <svg
        id="Layer_1"
        data-name="Layer 1"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 138.72 92.46"
        width="120"
        height="80"
        style={{ display: "block", animation: "flashBlue 1.2s ease-in-out infinite alternate" }}
      >
        <defs>
          <linearGradient id="blueGradient" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#87CEFA" stopOpacity="1" />
            <stop offset="100%" stopColor="#B0E0E6" stopOpacity="1" />
          </linearGradient>
        </defs>
        <path d="M23.46,56.58l1.74-4.74C15.9,47.58,8.64,40.08,8.64,27,8.64,12.42,20.46,5.18,34.8,5.18H74.94l26-.1c16.44,0,27.18,9,27.18,23.46,0,9-3.48,16-11,20.46L120,53c8.4-4.74,13.14-13.56,13.14-24.48,0-16-11.52-28.5-32.22-28.5H74.48V0H34.8C18.18,0,3.6,9.12,3.6,27,3.6,40.92,10.68,50.82,23.46,56.58Z" fill="url(#blueGradient)" />
        <path d="M106,45.82c9.18-1.32,14.52-7.74,14.52-17.28,0-10.08-7.32-16.62-18.72-16.62H82.5V34.36h5V17h14.28c8.34,0,13.68,4,13.68,11.58,0,6.72-3.18,12.66-14.28,12.66H96.3l32.4,43.68h-8.88L87.72,41.2H82.5V84.88H74.94v-73H34.8c-13.32,0-18.6,7.28-18.6,15,0,11.76,7.38,16.14,14.88,20.16s15.36,7.26,15.36,18.84c0,6.72-5.4,9.6-15.12,9.6-8.16,0-17-3.36-25.2-7.68L0,84.12C9,89,18.66,92.46,31.32,92.46c19,0,32.76-9,32.76-26.52,0-16.56-8.52-26.88-24.18-33.24l-1.68,4.74C52.62,43.38,59,52.38,59,65.94c0,6.78-2.46,12.18-7.26,15.84s-11.94,5.64-20.46,5.64a55.51,55.51,0,0,1-25-5.76l2.58-6.84c8.22,3.84,15.78,5.76,22.44,5.76,17.58,0,20.16-9.18,20.16-14.64,0-14.28-9.54-18.72-17.88-23.22-6.54-3.54-12.36-6.54-12.36-15.78,0-6.36,4.62-10,13.56-10H69.9v73H87.54V49.42l29.7,40.5h21.48Z" fill="url(#blueGradient)" />
        <style>{`
          @keyframes flashBlue {
            0% { filter: drop-shadow(0 0 0px #87CEFA) brightness(0.7) opacity(0.7); }
            100% { filter: drop-shadow(0 0 18px #87CEFA) brightness(1.2) opacity(1); }
          }
        `}</style>
      </svg>
    </div>
  );
}
