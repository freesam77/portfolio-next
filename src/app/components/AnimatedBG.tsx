"use client";

import { useRef, useEffect } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  flashTimer: number;
}

const NUM_NODES = 120;
const MAX_DISTANCE = 300;

const AnimatedBG: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodes = useRef<Node[]>([]);

  useEffect(() => {
    let scrollY = 0;

    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Initialize nodes
    for (let i = 0; i < NUM_NODES; i++) {
      nodes.current.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: 1 + Math.random() * 3,
        flashTimer: Math.random() * 5000,
      });
    }

    let currentFlashingNodeIndex = Math.floor(Math.random() * NUM_NODES);
    let flashCooldown = 0;
    nodes.current[currentFlashingNodeIndex].flashTimer = 100;

    const animate = () => {
      if (!ctx) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const parallaxOffset = scrollY * 0.1;

      // Draw connections
      for (let i = 0; i < nodes.current.length; i++) {
        for (let j = i + 1; j < nodes.current.length; j++) {
          const a = nodes.current[i];
          const b = nodes.current[j];
          const dist = Math.hypot(
            a.x - b.x,
            a.y - parallaxOffset - (b.y - parallaxOffset),
          );

          if (dist < MAX_DISTANCE) {
            const connectedToFlash =
              i === currentFlashingNodeIndex || j === currentFlashingNodeIndex;

            ctx.beginPath();
            ctx.strokeStyle = connectedToFlash
              ? `rgba(56, 189, 248, ${1 - dist / MAX_DISTANCE})`
              : `rgba(255, 255, 255, ${1 - dist / MAX_DISTANCE})`;

            ctx.moveTo(a.x, a.y - parallaxOffset);
            ctx.lineTo(b.x, b.y - parallaxOffset);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.current.forEach((node, index) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
        if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;

        let flashProgress = 0;
        const isFlashing = index === currentFlashingNodeIndex;

        if (isFlashing) {
          node.flashTimer -= 1;
          const flashDuration = 100;

          if (node.flashTimer < flashDuration) {
            const t = (flashDuration - node.flashTimer) / flashDuration;
            flashProgress = Math.sin((t * Math.PI) / 2);
          }

          if (node.flashTimer <= 0 && flashCooldown <= 0) {
            let nextIndex;
            do {
              nextIndex = Math.floor(Math.random() * NUM_NODES);
            } while (nextIndex === currentFlashingNodeIndex);

            currentFlashingNodeIndex = nextIndex;
            nodes.current[currentFlashingNodeIndex].flashTimer =
              100 + Math.random() * 50;
            flashCooldown = 50;
          }
        } else {
          node.flashTimer = 0;
        }

        if (flashCooldown > 0) flashCooldown -= 1;

        const radius =
          node.radius + (isFlashing ? flashProgress * node.radius * 0.6 : 0);
        const color = isFlashing ? "#38bdf8" : "#ffffff";

        ctx.beginPath();
        ctx.arc(node.x, node.y - parallaxOffset, radius, 0, Math.PI * 2);
        ctx.fillStyle = color;

        ctx.shadowColor = color;
        ctx.shadowBlur = isFlashing ? flashProgress * 20 : 0;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        width: "100%",
        height: "100%",
        backgroundColor: "#000",
      }}
    />
  );
};

export default AnimatedBG;
