"use client";

import { useEffect, useState, type CSSProperties } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  delay: number;
  size: number;
  rotation: number;
}

function createParticles(): Particle[] {
  const particles: Particle[] = [];
  const count = 16;

  for (let i = 0; i < count; i++) {
    const edge = i % 4;
    const t = (Math.floor(i / 4) + Math.random() * 0.4) / 4;

    let x: number;
    let y: number;
    let dx: number;
    let dy: number;

    if (edge === 0) {
      x = t * 100;
      y = 0;
      dx = (Math.random() - 0.5) * 60;
      dy = -(40 + Math.random() * 50);
    } else if (edge === 1) {
      x = 100;
      y = t * 100;
      dx = 40 + Math.random() * 50;
      dy = (Math.random() - 0.5) * 60;
    } else if (edge === 2) {
      x = t * 100;
      y = 100;
      dx = (Math.random() - 0.5) * 60;
      dy = 40 + Math.random() * 50;
    } else {
      x = 0;
      y = t * 100;
      dx = -(40 + Math.random() * 50);
      dy = (Math.random() - 0.5) * 60;
    }

    particles.push({
      id: i,
      x,
      y,
      dx,
      dy,
      delay: Math.random() * 0.15,
      size: 10 + Math.random() * 10,
      rotation: Math.random() * 40 - 20,
    });
  }

  return particles;
}

interface HeartBurstProps {
  active: boolean;
}

export function HeartBurst({ active }: HeartBurstProps) {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    if (active) {
      setParticles(createParticles());
    }
  }, [active]);

  if (!active || particles.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-20 overflow-visible" aria-hidden>
      {particles.map((particle) => (
        <span
          key={particle.id}
          className="heart-particle absolute text-[#D4566A]"
          style={
            {
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              fontSize: particle.size,
              "--dx": `${particle.dx}px`,
              "--dy": `${particle.dy}px`,
              "--delay": `${particle.delay}s`,
              "--rotation": `${particle.rotation}deg`,
            } as CSSProperties
          }
        >
          ♥
        </span>
      ))}
    </div>
  );
}
