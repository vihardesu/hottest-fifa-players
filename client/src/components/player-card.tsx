"use client";

import type { MatchupPlayer } from "@/lib/types";
import { cx } from "@/utils/cx";

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
        "group flex w-full flex-col overflow-hidden rounded-2xl border bg-primary_alt text-left shadow-xs transition duration-200",
        "hover:border-brand-solid hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring",
        "disabled:pointer-events-none disabled:opacity-60",
        selected ? "border-brand-solid ring-2 ring-brand-solid ring-offset-2 ring-offset-primary" : "border-secondary",
      )}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-tertiary">
        <img
          src={player.imageUrl}
          alt={player.name}
          className="size-full object-cover object-top transition duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <div className="flex flex-col gap-1 px-4 py-4">
        <p className="truncate text-base font-semibold text-primary">{player.name}</p>
        <p className="text-sm text-tertiary">ELO {player.elo}</p>
      </div>
    </button>
  );
}

export function PlayerCardSkeleton() {
  return (
    <div className="flex w-full flex-col overflow-hidden rounded-2xl border border-secondary bg-primary_alt">
      <div className="aspect-[3/4] w-full animate-pulse bg-tertiary" />
      <div className="space-y-2 px-4 py-4">
        <div className="h-5 w-3/4 animate-pulse rounded bg-tertiary" />
        <div className="h-4 w-1/2 animate-pulse rounded bg-tertiary" />
      </div>
    </div>
  );
}
