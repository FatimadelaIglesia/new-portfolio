"use client";

import { useRef } from "react";

export default function ParallaxFrame({
  children,
}: {
  children: React.ReactNode;
}) {
  const frameRef = useRef<HTMLDivElement>(null);

  function handleMove(event: React.MouseEvent<HTMLDivElement>) {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    frame.style.setProperty("--px", x.toFixed(3));
    frame.style.setProperty("--py", y.toFixed(3));
  }

  function handleLeave() {
    const frame = frameRef.current;
    if (!frame) return;
    frame.style.setProperty("--px", "0");
    frame.style.setProperty("--py", "0");
  }

  return (
    <div
      ref={frameRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      className="parallax relative -m-6 shrink-0 p-6"
    >
      {children}
    </div>
  );
}
