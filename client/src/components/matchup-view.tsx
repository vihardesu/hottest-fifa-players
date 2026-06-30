"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertFloating } from "@/components/application/alerts/alerts";
import { PlayerCard, PlayerCardSkeleton } from "@/components/player-card";
import type { MatchupResponse } from "@/lib/types";

async function fetchMatchup(): Promise<MatchupResponse> {
  const response = await fetch("/api/matchup");
  if (!response.ok) {
    throw new Error("Failed to load matchup");
  }
  return response.json();
}

export function MatchupView() {
  const [matchup, setMatchup] = useState<MatchupResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);

  const loadMatchup = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchMatchup();
      setMatchup(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMatchup();
  }, [loadMatchup]);

  const handleVote = async (winnerId: string) => {
    if (!matchup || voting) {
      return;
    }

    const loserId = matchup.players.find((player) => player.id !== winnerId)?.id;
    if (!loserId) {
      return;
    }

    setVoting(true);
    setSelectedId(winnerId);

    try {
      const response = await fetch("/api/vote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ winnerId, loserId }),
      });

      if (response.status === 429) {
        setRateLimited(true);
        setSelectedId(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Vote failed");
      }

      const data = await response.json();
      await new Promise((resolve) => setTimeout(resolve, 350));
      setMatchup(data.nextMatchup);
      setSelectedId(null);
    } catch {
      setSelectedId(null);
    } finally {
      setVoting(false);
    }
  };

  return (
    <div className="flex flex-1 flex-col gap-5 md:gap-8">
      <p className="text-center text-sm font-semibold tracking-wide text-[#4F4D46]/70 md:text-lg">
        Who&apos;s hotter?
      </p>

      <div className="flex flex-1 flex-col items-center gap-4 md:grid md:grid-cols-[1fr_auto_1fr] md:items-stretch md:gap-8">
        {loading || !matchup ? (
          <>
            <PlayerCardSkeleton />
            <div className="hidden md:block" />
            <PlayerCardSkeleton />
          </>
        ) : (
          <>
            <PlayerCard
              player={matchup.players[0]}
              disabled={voting}
              selected={selectedId === matchup.players[0].id}
              onVote={handleVote}
            />
            <div className="flex items-center justify-center md:py-8">
              <span className="rounded-full border-2 border-[#D4CDB8] bg-[#FAF7F0] px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#4F4D46]/60 md:px-5 md:py-2 md:text-sm">
                vs
              </span>
            </div>
            <PlayerCard
              player={matchup.players[1]}
              disabled={voting}
              selected={selectedId === matchup.players[1].id}
              onVote={handleVote}
            />
          </>
        )}
      </div>

      {rateLimited && (
        <div className="fixed inset-x-4 bottom-8 z-30 mx-auto max-w-md">
          <AlertFloating
            title="Slow down"
            description="You're voting too quickly. Wait a moment and try again."
            confirmLabel="Got it"
            color="warning"
            onClose={() => setRateLimited(false)}
            onConfirm={() => setRateLimited(false)}
          />
        </div>
      )}
    </div>
  );
}
