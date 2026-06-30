"use client";

import { useEffect, useRef, useState } from "react";
import { Avatar } from "@/components/base/avatar/avatar";
import { BadgeWithDot } from "@/components/base/badges/badges";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import type { LeaderboardEntry, RankingUpdateEvent } from "@/lib/types";
import { cx } from "@/utils/cx";

export function LeaderboardView() {
  const [rankings, setRankings] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [highlightedIds, setHighlightedIds] = useState<Set<string>>(new Set());
  const previousElos = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    const source = new EventSource("/api/leaderboard/stream");

    source.onopen = () => setLive(true);
    source.onerror = () => setLive(false);

    source.onmessage = (event) => {
      const payload = JSON.parse(event.data) as RankingUpdateEvent;
      const nextRankings = payload.rankings;

      if (payload.type === "ranking_update") {
        const changed = new Set<string>();
        nextRankings.forEach((entry) => {
          const previous = previousElos.current.get(entry.id);
          if (previous !== undefined && previous !== entry.elo) {
            changed.add(entry.id);
          }
        });

        if (changed.size > 0) {
          setHighlightedIds(changed);
          window.setTimeout(() => setHighlightedIds(new Set()), 1200);
        }
      }

      nextRankings.forEach((entry) => {
        previousElos.current.set(entry.id, entry.elo);
      });

      setRankings(nextRankings);
      setLoading(false);
    };

    return () => {
      source.close();
      setLive(false);
    };
  }, []);

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex items-center gap-3">
        <BadgeWithDot color={live ? "success" : "gray"} size="sm" type="pill-color">
          LIVE
        </BadgeWithDot>
        <p className="text-sm font-medium text-secondary md:text-base">
          Global Hotness Rankings
        </p>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center py-16">
          <LoadingIndicator type="line-spinner" size="md" label="Loading rankings..." />
        </div>
      ) : (
        <ol className="divide-y divide-secondary overflow-hidden rounded-2xl border border-secondary bg-primary_alt">
          {rankings.map((entry) => (
            <li
              key={entry.id}
              className={cx(
                "flex items-center gap-3 px-4 py-3 transition-colors duration-500 md:gap-4 md:px-5 md:py-4",
                highlightedIds.has(entry.id) && "bg-utility-brand-50",
              )}
            >
              <span className="w-8 shrink-0 text-sm font-semibold text-tertiary md:w-10 md:text-base">
                #{entry.rank}
              </span>
              <Avatar src={entry.imageUrl} alt={entry.name} size="md" />
              <span className="min-w-0 flex-1 truncate text-sm font-medium text-primary md:text-base">
                {entry.name}
              </span>
              <span className="shrink-0 text-sm font-semibold text-secondary md:text-base">
                {entry.elo}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
