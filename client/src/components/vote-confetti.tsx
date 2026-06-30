"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { createPortal } from "react-dom";

const CONFETTI_COLORS = [
  "#D4566A",
  "#C4A882",
  "#E8B86D",
  "#9EC5E8",
  "#8BC9A5",
  "#F5E6D3",
  "#B8A070",
  "#4F4D46",
];

interface ConfettiPiece {
  id: number;
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
  delay: number;
  duration: number;
  drift: number;
  spin: number;
  shape: "rect" | "circle" | "strip";
  variant: "fall" | "pop" | "swoop";
}

function createConfetti(): ConfettiPiece[] {
  const pieces: ConfettiPiece[] = [];

  for (let i = 0; i < 52; i++) {
    const variant = i < 34 ? "fall" : i < 44 ? "pop" : "swoop";
    const shape = Math.random() > 0.55 ? "rect" : Math.random() > 0.5 ? "circle" : "strip";

    pieces.push({
      id: i,
      left: Math.random() * 100,
      top: variant === "pop" ? 20 + Math.random() * 60 : -5 - Math.random() * 8,
      width: shape === "strip" ? 3 + Math.random() * 3 : 6 + Math.random() * 8,
      height: shape === "strip" ? 14 + Math.random() * 10 : 6 + Math.random() * 8,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!,
      delay: Math.random() * 0.35,
      duration: 1.1 + Math.random() * 0.9,
      drift: (Math.random() - 0.5) * 120,
      spin: (Math.random() - 0.5) * 720,
      shape,
      variant,
    });
  }

  return pieces;
}

interface VoteConfettiProps {
  burst: number;
}

export function VoteConfetti({ burst }: VoteConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (burst === 0) {
      return;
    }

    setPieces(createConfetti());
    const timeout = window.setTimeout(() => setPieces([]), 2200);
    return () => window.clearTimeout(timeout);
  }, [burst]);

  if (!mounted || pieces.length === 0) {
    return null;
  }

  return createPortal(
    <div className="pointer-events-none fixed inset-0 z-[100] overflow-hidden" aria-hidden>
      {pieces.map((piece) => (
        <span
          key={`${burst}-${piece.id}`}
          className={`confetti-piece confetti-piece--${piece.variant}`}
          style={
            {
              left: `${piece.left}%`,
              top: `${piece.top}%`,
              width: piece.width,
              height: piece.height,
              backgroundColor: piece.color,
              borderRadius: piece.shape === "circle" ? "9999px" : piece.shape === "strip" ? "2px" : "1px",
              "--drift": `${piece.drift}px`,
              "--spin": `${piece.spin}deg`,
              "--delay": `${piece.delay}s`,
              "--duration": `${piece.duration}s`,
            } as CSSProperties
          }
        />
      ))}
    </div>,
    document.body,
  );
}
