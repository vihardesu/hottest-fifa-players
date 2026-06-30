"use client";

import type { MatchupPlayer } from "@/lib/types";
import { cx } from "@/utils/cx";
import { HeartBurst } from "@/components/heart-burst";
import { PlayerCardVisual } from "@/components/player-card-visual";

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
        "group relative flex w-full text-left transition-all duration-300",
        "max-md:mx-auto max-md:h-auto max-md:max-w-[min(100%,calc((100dvh-10.5rem)/2.35))]",
        "md:h-full md:min-h-0",
        "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#C4A882]",
        "disabled:pointer-events-none disabled:opacity-60",
        selected && "z-10",
      )}
    >
      <PlayerCardVisual
        name={player.name}
        imageUrl={player.imageUrl}
        country={player.country}
        countryCode={player.countryCode}
        birthDate={player.birthDate}
        heightCm={player.heightCm}
        className={cx(
          "max-md:h-auto md:h-full md:min-h-0 transition-all duration-300 md:group-hover:-translate-y-1 md:group-hover:shadow-2xl",
          selected
            ? "border-[#D4566A] shadow-[0_8px_32px_rgba(212,86,106,0.25)] ring-2 ring-[#D4566A]/30 md:scale-[1.03]"
            : "group-hover:border-[#C4A882] group-hover:shadow-xl",
        )}
      />

      <HeartBurst active={!!selected} />
    </button>
  );
}

export function PlayerCardSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-[min(100%,calc((100dvh-10.5rem)/2.35))] flex-col overflow-hidden rounded-xl border-2 border-[#D4CDB8] bg-[#FAF7F0] shadow-lg md:mx-0 md:h-full md:max-w-none md:rounded-3xl md:border-[3px]">
      <div className="aspect-square w-full shrink-0 animate-pulse bg-[#E8E2D0] md:min-h-0 md:flex-1 md:aspect-[4/5]" />
      <div className="shrink-0 border-t-2 border-[#D4CDB8] px-2 py-2 md:px-5 md:py-4">
        <div className="mx-auto h-3 w-3/4 animate-pulse rounded bg-[#D4CDB8]/60 md:h-5" />
        <div className="mx-auto mt-1.5 hidden h-3 w-1/2 animate-pulse rounded bg-[#D4CDB8]/40 md:block" />
      </div>
    </div>
  );
}
