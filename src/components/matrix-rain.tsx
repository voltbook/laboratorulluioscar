"use client";

import { useEffect, useRef } from "react";

export function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];
    let frame = 0;
    const chars = "01ESP32DIYLABOSCAR<>/{}[]";

    const resize = () => {
      width = canvas.width = window.innerWidth * window.devicePixelRatio;
      height = canvas.height = window.innerHeight * window.devicePixelRatio;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      columns = Math.floor(width / 18);
      drops = Array.from({ length: columns }, () => Math.random() * height);
    };

    const draw = () => {
      frame = requestAnimationFrame(draw);
      ctx.fillStyle = "rgba(0, 0, 0, 0.08)";
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = "rgba(0, 255, 102, 0.26)";
      ctx.font = `${14 * window.devicePixelRatio}px monospace`;
      drops.forEach((drop, index) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, index * 18, drop);
        drops[index] = drop > height && Math.random() > 0.975 ? 0 : drop + 18;
      });
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 opacity-40" />;
}
