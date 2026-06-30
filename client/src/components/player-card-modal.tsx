"use client";

import { useEffect } from "react";
import { X } from "@untitledui/icons";
import { PlayerCardVisual } from "@/components/player-card-visual";
import type { LeaderboardEntry } from "@/lib/types";

interface PlayerCardModalProps {
  entry: LeaderboardEntry | null;
  onClose: () => void;
}

export function PlayerCardModal({ entry, onClose }: PlayerCardModalProps) {
  useEffect(() => {
    if (!entry) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [entry, onClose]);

  if (!entry) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#EDE8D0]/95 p-4 backdrop-blur-sm md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="player-card-modal-title"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 flex size-10 items-center justify-center rounded-full border-2 border-[#D4CDB8] bg-[#FAF7F0] text-[#4F4D46] shadow-md transition hover:border-[#C4A882] hover:bg-[#F5F0E4] md:top-6 md:right-6"
        aria-label="Close"
      >
        <X className="size-5" />
      </button>

      <div
        className="w-full max-w-sm animate-in fade-in zoom-in-95 duration-200 md:max-w-md"
        onClick={(event) => event.stopPropagation()}
      >
        <PlayerCardVisual
          name={entry.name}
          imageUrl={entry.imageUrl}
          country={entry.country}
          countryCode={entry.countryCode}
          birthDate={entry.birthDate}
          heightCm={entry.heightCm}
          rank={entry.rank}
          subtitle={`Score ${entry.elo}`}
          className="shadow-2xl"
        />
        <p id="player-card-modal-title" className="sr-only">
          {entry.name}, rank {entry.rank}
        </p>
      </div>
    </div>
  );
}
