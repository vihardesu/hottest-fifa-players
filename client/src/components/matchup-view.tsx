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
    <div className="flex flex-1 flex-col gap-6">
      <div className="grid flex-1 grid-cols-2 gap-3 md:gap-6">
        {loading || !matchup ? (
          <>
            <PlayerCardSkeleton />
            <PlayerCardSkeleton />
          </>
        ) : (
          matchup.players.map((player) => (
            <PlayerCard
              key={player.id}
              player={player}
              disabled={voting}
              selected={selectedId === player.id}
              onVote={handleVote}
            />
          ))
        )}
      </div>

      <p className="text-center text-sm font-medium text-secondary md:text-base">
        Who&apos;s hotter?
      </p>

      {rateLimited && (
        <div className="fixed inset-x-4 bottom-24 z-30 mx-auto max-w-md">
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
