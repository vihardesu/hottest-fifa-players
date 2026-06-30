"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AlertFloating } from "@/components/application/alerts/alerts";
import { PlayerCard, PlayerCardSkeleton } from "@/components/player-card";
import { VoteConfetti } from "@/components/vote-confetti";
import {
  fetchMatchupFromApi,
  MatchupPrefetcher,
  warmMatchupImages,
} from "@/lib/matchup-prefetch";
import { getOrCreateSessionId } from "@/lib/session-id";
import type { MatchupResponse, VoteResponse } from "@/lib/types";
import { cx } from "@/utils/cx";

const FADE_MS = 150;

export function MatchupView() {
  const [matchup, setMatchup] = useState<MatchupResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [voting, setVoting] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);
  const [cardsVisible, setCardsVisible] = useState(true);
  const [confettiBurst, setConfettiBurst] = useState(0);
  const prefetcher = useRef(new MatchupPrefetcher());
  const votingRef = useRef(false);

  const loadMatchup = useCallback(async () => {
    setLoading(true);
    setCardsVisible(false);
    try {
      const data = await fetchMatchupFromApi();
      await warmMatchupImages(data);
      setMatchup(data);
      prefetcher.current.schedule(data.matchupId);
      requestAnimationFrame(() => setCardsVisible(true));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMatchup();
  }, [loadMatchup]);

  useEffect(() => {
    if (matchup && !loading) {
      prefetcher.current.schedule(matchup.matchupId);
    }
  }, [matchup, loading]);

  const revealMatchup = useCallback((next: MatchupResponse) => {
    setCardsVisible(false);
    window.setTimeout(() => {
      setMatchup(next);
      setSelectedId(null);
      prefetcher.current.schedule(next.matchupId);
      requestAnimationFrame(() => setCardsVisible(true));
    }, FADE_MS);
  }, []);

  const rollbackMatchup = useCallback((previous: MatchupResponse) => {
    setMatchup(previous);
    setSelectedId(null);
    setCardsVisible(true);
    prefetcher.current.schedule(previous.matchupId);
  }, []);

  const handleVote = useCallback(
    (winnerId: string) => {
      if (!matchup || votingRef.current) {
        return;
      }

      const loserId = matchup.players.find((player) => player.id !== winnerId)?.id;
      if (!loserId) {
        return;
      }

      const previousMatchup = matchup;

      votingRef.current = true;
      setVoting(true);
      setSelectedId(winnerId);
      setConfettiBurst((burst) => burst + 1);

      const releaseVoting = () => {
        votingRef.current = false;
        setVoting(false);
      };

      const votePromise = fetch("/api/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-Id": getOrCreateSessionId(),
        },
        body: JSON.stringify({ winnerId, loserId }),
        keepalive: true,
      });

      void (async () => {
        let swapped = false;
        const prefetched = prefetcher.current.consume();

        if (prefetched) {
          revealMatchup(prefetched);
          swapped = true;
        } else {
          const warmed = await prefetcher.current.waitForReady(700);
          if (warmed) {
            revealMatchup(warmed);
            swapped = true;
          }
        }

        try {
          const response = await votePromise;
          const data = (await response.json().catch(() => ({}))) as VoteResponse & {
            message?: string;
          };

          if (response.status === 429) {
            rollbackMatchup(previousMatchup);
            setRateLimitMessage(
              data.message ?? "You're voting too quickly. Wait a moment and try again.",
            );
            setRateLimited(true);
            releaseVoting();
            return;
          }

          if (!response.ok) {
            rollbackMatchup(previousMatchup);
            releaseVoting();
            return;
          }

          if (!swapped && data.nextMatchup) {
            await warmMatchupImages(data.nextMatchup);
            revealMatchup(data.nextMatchup);
          }

          releaseVoting();
        } catch {
          rollbackMatchup(previousMatchup);
          releaseVoting();
        }
      })();
    },
    [matchup, revealMatchup, rollbackMatchup],
  );

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-1 md:gap-8">
      <VoteConfetti burst={confettiBurst} />
      <h2 className="flex shrink-0 items-center justify-center gap-1 text-center text-base font-bold leading-tight text-[#4F4D46] md:gap-3 md:text-4xl">
        <span className="text-[1.1em] leading-none" aria-hidden="true">
          🔥
        </span>
        Who&apos;s hotter?
        <span className="text-[1.1em] leading-none" aria-hidden="true">
          😍
        </span>
      </h2>

      <div className="flex min-h-0 w-full flex-1 items-center justify-center overflow-hidden md:items-stretch md:py-8">
        {loading || !matchup ? (
          <div className="grid w-full max-w-full grid-cols-1 content-center justify-items-center gap-1 md:h-full md:grid-cols-[1fr_auto_1fr] md:grid-rows-none md:content-stretch md:items-center md:gap-8">
            <PlayerCardSkeleton />
            <div className="flex shrink-0 items-center justify-center self-center py-0.5">
              <span className="rounded-full border-2 border-[#D4CDB8] bg-[#FAF7F0]/80 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#4F4D46]/60 md:px-5 md:py-2 md:text-sm">
                vs
              </span>
            </div>
            <PlayerCardSkeleton />
          </div>
        ) : (
          <div
            key={matchup.matchupId}
            className={cx(
              "grid w-full max-w-full grid-cols-1 content-center justify-items-center gap-1 transition-opacity duration-150 ease-out md:h-full md:grid-cols-[1fr_auto_1fr] md:grid-rows-none md:content-stretch md:items-center md:gap-8",
              cardsVisible ? "opacity-100" : "pointer-events-none opacity-0",
            )}
          >
            <PlayerCard
              player={matchup.players[0]}
              disabled={voting}
              selected={selectedId === matchup.players[0].id}
              onVote={handleVote}
            />
            <div className="z-10 flex shrink-0 items-center justify-center self-center py-0.5 md:py-8">
              <span className="rounded-full border-2 border-[#D4CDB8] bg-[#FAF7F0]/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-[#4F4D46]/60 shadow-sm md:px-5 md:py-2 md:text-sm">
                vs
              </span>
            </div>
            <PlayerCard
              player={matchup.players[1]}
              disabled={voting}
              selected={selectedId === matchup.players[1].id}
              onVote={handleVote}
            />
          </div>
        )}
      </div>

      {rateLimited && (
        <div className="fixed inset-x-4 bottom-8 z-30 mx-auto max-w-md">
          <AlertFloating
            title="Slow down"
            description={
              rateLimitMessage ?? "You're voting too quickly. Wait a moment and try again."
            }
            confirmLabel="Got it"
            color="warning"
            onClose={() => {
              setRateLimited(false);
              setRateLimitMessage(null);
            }}
            onConfirm={() => {
              setRateLimited(false);
              setRateLimitMessage(null);
            }}
          />
        </div>
      )}
    </div>
  );
}
