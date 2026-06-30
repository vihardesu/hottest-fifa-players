"use client";

import type { MatchupPlayer } from "@/lib/types";
import { cx } from "@/utils/cx";
import { HeartBurst } from "@/components/heart-burst";

interface PlayerCardProps {
  player: MatchupPlayer;
  disabled?: boolean;
  selected?: boolean;
  onVote: (playerId: string) => void;
}

export function PlayerCard({ player, disabled, selected, onVote }: PlayerCardProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onVote(player.id)}
      className={cx(
        "group relative flex w-full flex-col overflow-visible text-left transition-all duration-300",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C4A882]",
        "disabled:pointer-events-none disabled:opacity-60",
        "md:hover:-translate-y-1 md:hover:shadow-2xl",
        selected && "scale-[1.02] md:scale-[1.03]",
      )}
    >
      <div
        className={cx(
          "relative flex flex-col overflow-hidden rounded-2xl border-2 bg-[#FAF7F0] shadow-lg transition-all duration-300",
          "md:rounded-3xl md:border-[3px] md:shadow-xl",
          selected
            ? "border-[#D4566A] shadow-[0_8px_32px_rgba(212,86,106,0.25)] ring-2 ring-[#D4566A]/30"
            : "border-[#D4CDB8] group-hover:border-[#C4A882] group-hover:shadow-xl",
        )}
      >
        <HeartBurst active={!!selected} />

        <div className="relative overflow-hidden bg-[#E8E2D0]">
          <div className="player-face-crop aspect-square w-full md:aspect-[4/5]">
            <img
              src={player.imageUrl}
              alt={player.name}
              className="player-face-image transition duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/5" />
        </div>

        <div className="relative border-t-2 border-[#D4CDB8] bg-gradient-to-b from-[#F5F0E4] to-[#EDE8D0] px-4 py-3 md:px-5 md:py-4">
          <p className="truncate text-center text-sm font-bold uppercase tracking-wider text-[#4F4D46] md:text-base">
            {player.name}
          </p>
        </div>
      </div>
    </button>
  );
}

export function PlayerCardSkeleton() {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border-2 border-[#D4CDB8] bg-[#FAF7F0] shadow-lg md:rounded-3xl md:border-[3px]">
      <div className="aspect-square w-full animate-pulse bg-[#E8E2D0] md:aspect-[4/5]" />
      <div className="border-t-2 border-[#D4CDB8] px-4 py-3 md:px-5 md:py-4">
        <div className="mx-auto h-4 w-3/4 animate-pulse rounded bg-[#D4CDB8]/60 md:h-5" />
      </div>
    </div>
  );
}
