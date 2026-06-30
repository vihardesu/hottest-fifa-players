"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { LoadingIndicator } from "@/components/application/loading-indicator/loading-indicator";
import { PlayerCardModal } from "@/components/player-card-modal";
import { getFlagUrl } from "@/lib/country-flags";
import type {
  CountryLeaderboardEntry,
  CountryRankingUpdateEvent,
  LeaderboardEntry,
  RankingUpdateEvent,
} from "@/lib/types";
import { formatLastUpdated } from "@/lib/ui-utils";
import { cx } from "@/utils/cx";

type LeaderboardTab = "players" | "countries";

const TAB_COPY: Record<LeaderboardTab, { title: string; subtitle: string }> = {
  players: {
    title: "Players",
    subtitle: "Global hotness rankings",
  },
  countries: {
    title: "Nations",
    subtitle: "Hottest squad by country — defend your flag",
  },
};

function LiveBadge({ live }: { live: boolean }) {
  return (
    <span
      className={cx(
        "inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1",
        "font-[family-name:var(--font-inter)] text-[11px] font-semibold uppercase leading-none tracking-wider",
        live
          ? "border-green-300/60 bg-green-50 text-green-800"
          : "border-[#D4CDB8] bg-[#FAF7F0] text-[#4F4D46]/50",
      )}
    >
      <span
        className={cx("size-1.5 shrink-0 rounded-full", live ? "bg-green-500" : "bg-[#4F4D46]/30")}
        aria-hidden
      />
      Live
    </span>
  );
}

function LeaderboardTabs({
  active,
  onChange,
}: {
  active: LeaderboardTab;
  onChange: (tab: LeaderboardTab) => void;
}) {
  return (
    <div
      className="inline-flex rounded-full border-2 border-[#D4CDB8] bg-[#FAF7F0] p-1"
      role="tablist"
      aria-label="Leaderboard views"
    >
      {(Object.keys(TAB_COPY) as LeaderboardTab[]).map((tab) => (
        <button
          key={tab}
          type="button"
          role="tab"
          aria-selected={active === tab}
          onClick={() => onChange(tab)}
          className={cx(
            "rounded-full px-3 py-1.5 text-xs font-semibold transition md:px-4 md:py-2 md:text-sm",
            active === tab
              ? "bg-[#F5F0E4] text-[#4F4D46] shadow-sm ring-1 ring-[#D4CDB8]/80"
              : "text-[#4F4D46]/55 hover:text-[#4F4D46]/80",
          )}
        >
          {TAB_COPY[tab].title}
        </button>
      ))}
    </div>
  );
}

function PlayerLeaderboard({
  rankings,
  highlightedIds,
  onSelect,
}: {
  rankings: LeaderboardEntry[];
  highlightedIds: Set<string>;
  onSelect: (entry: LeaderboardEntry) => void;
}) {
  return (
    <ol className="divide-y divide-[#D4CDB8] overflow-hidden rounded-2xl border-2 border-[#D4CDB8] bg-[#FAF7F0]">
      {rankings.map((entry) => (
        <li key={entry.id}>
          <button
            type="button"
            onClick={() => onSelect(entry)}
            className={cx(
              "flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition-colors duration-500 md:gap-4 md:px-5 md:py-4",
              "hover:bg-[#F5F0E4] focus-visible:bg-[#F5F0E4] focus-visible:outline-none",
              highlightedIds.has(entry.id) && "bg-[#F5E6D3]",
            )}
          >
            <span className="w-8 shrink-0 text-sm font-semibold text-[#4F4D46]/50 md:w-10 md:text-base">
              #{entry.rank}
            </span>
            <div className="player-face-crop player-face-crop--round size-10 shrink-0 md:size-12">
              <img src={entry.imageUrl} alt={entry.name} className="player-face-image" />
            </div>
            <span className="min-w-0 flex-1 truncate text-sm font-medium text-[#4F4D46] md:text-base">
              {entry.name}
            </span>
            <span className="shrink-0 text-sm font-semibold text-[#4F4D46]/60 md:text-base">
              {entry.elo}
            </span>
          </button>
        </li>
      ))}
    </ol>
  );
}

function CountryLeaderboard({
  rankings,
  highlightedIds,
}: {
  rankings: CountryLeaderboardEntry[];
  highlightedIds: Set<string>;
}) {
  return (
    <ol className="divide-y divide-[#D4CDB8] overflow-hidden rounded-2xl border-2 border-[#D4CDB8] bg-[#FAF7F0]">
      {rankings.map((entry) => {
        const flagUrl = getFlagUrl(entry.countryCode, 80);

        return (
          <li key={entry.id}>
            <div
              className={cx(
                "flex items-center gap-3 px-4 py-3 transition-colors duration-500 md:gap-4 md:px-5 md:py-4",
                highlightedIds.has(entry.id) && "bg-[#F5E6D3]",
              )}
            >
              <span className="w-8 shrink-0 text-sm font-semibold text-[#4F4D46]/50 md:w-10 md:text-base">
                #{entry.rank}
              </span>

              {flagUrl ? (
                <Image
                  src={flagUrl}
                  alt=""
                  width={40}
                  height={30}
                  className="h-7 w-10 shrink-0 rounded-md object-cover shadow-sm ring-1 ring-[#D4CDB8]/80 md:h-8 md:w-11"
                  aria-hidden
                />
              ) : (
                <span
                  className="size-7 shrink-0 rounded-md bg-[#D4CDB8]/60 md:size-8"
                  aria-hidden
                />
              )}

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-[#4F4D46] md:text-base">
                  {entry.country}
                </p>
                <p className="text-xs text-[#4F4D46]/50 md:text-sm">
                  {entry.playerCount} players · face: {entry.topPlayer.name}
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-2 md:gap-3">
                <div className="player-face-crop player-face-crop--round size-8 shrink-0 md:size-10">
                  <img
                    src={entry.topPlayer.imageUrl}
                    alt={entry.topPlayer.name}
                    className="player-face-image"
                  />
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#4F4D46] md:text-base">
                    {entry.squadScore}
                  </p>
                  <p className="text-[10px] font-medium uppercase tracking-wide text-[#4F4D46]/45 md:text-xs">
                    squad
                  </p>
                </div>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function LeaderboardView() {
  const [tab, setTab] = useState<LeaderboardTab>("players");
  const [playerRankings, setPlayerRankings] = useState<LeaderboardEntry[]>([]);
  const [countryRankings, setCountryRankings] = useState<CountryLeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [highlightedPlayerIds, setHighlightedPlayerIds] = useState<Set<string>>(new Set());
  const [highlightedCountryIds, setHighlightedCountryIds] = useState<Set<string>>(new Set());
  const [selectedEntry, setSelectedEntry] = useState<LeaderboardEntry | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const previousPlayerElos = useRef<Map<string, number>>(new Map());
  const previousCountryScores = useRef<Map<string, number>>(new Map());
  const hasPlayerData = useRef(false);
  const hasCountryData = useRef(false);

  useEffect(() => {
    if (tab !== "players") {
      return;
    }

    setLoading(!hasPlayerData.current);
    const source = new EventSource("/api/leaderboard/stream");

    source.onopen = () => setLive(true);
    source.onerror = () => setLive(false);

    source.onmessage = (event) => {
      const payload = JSON.parse(event.data) as RankingUpdateEvent;

      if (payload.type === "error") {
        setLive(false);
        setLoading(false);
        return;
      }

      const nextRankings = payload.rankings;
      if (!nextRankings) {
        return;
      }

      if (payload.type === "ranking_update") {
        const changed = new Set<string>();
        nextRankings.forEach((entry) => {
          const previous = previousPlayerElos.current.get(entry.id);
          if (previous !== undefined && previous !== entry.elo) {
            changed.add(entry.id);
          }
        });

        if (changed.size > 0) {
          setHighlightedPlayerIds(changed);
          window.setTimeout(() => setHighlightedPlayerIds(new Set()), 1200);
        }
      }

      nextRankings.forEach((entry) => {
        previousPlayerElos.current.set(entry.id, entry.elo);
      });

      setPlayerRankings(nextRankings);
      hasPlayerData.current = true;
      setLastUpdated(new Date());
      setLoading(false);
    };

    return () => {
      source.close();
      setLive(false);
    };
  }, [tab]);

  useEffect(() => {
    if (tab !== "countries") {
      return;
    }

    setLoading(!hasCountryData.current);
    const source = new EventSource("/api/leaderboard/countries/stream");

    source.onopen = () => setLive(true);
    source.onerror = () => setLive(false);

    source.onmessage = (event) => {
      const payload = JSON.parse(event.data) as CountryRankingUpdateEvent;

      if (payload.type === "error") {
        setLive(false);
        setLoading(false);
        return;
      }

      const nextRankings = payload.rankings;
      if (!nextRankings) {
        return;
      }

      if (payload.type === "ranking_update") {
        const changed = new Set<string>();
        nextRankings.forEach((entry) => {
          const previous = previousCountryScores.current.get(entry.id);
          if (previous !== undefined && previous !== entry.squadScore) {
            changed.add(entry.id);
          }
        });

        if (changed.size > 0) {
          setHighlightedCountryIds(changed);
          window.setTimeout(() => setHighlightedCountryIds(new Set()), 1200);
        }
      }

      nextRankings.forEach((entry) => {
        previousCountryScores.current.set(entry.id, entry.squadScore);
      });

      setCountryRankings(nextRankings);
      hasCountryData.current = true;
      setLastUpdated(new Date());
      setLoading(false);
    };

    return () => {
      source.close();
      setLive(false);
    };
  }, [tab]);

  const activeCopy = TAB_COPY[tab];

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <LeaderboardTabs active={tab} onChange={setTab} />
          <div className="flex items-center gap-3">
            <LiveBadge live={live} />
            {lastUpdated && (
              <p className="text-xs text-[#4F4D46]/45">
                Last updated {formatLastUpdated(lastUpdated)}
              </p>
            )}
          </div>
        </div>
        <p className="text-sm font-medium text-[#4F4D46]/70 md:text-base">{activeCopy.subtitle}</p>
      </div>

      {loading ? (
        <div className="flex flex-1 items-center justify-center py-16">
          <LoadingIndicator type="line-spinner" size="md" label="Loading rankings..." />
        </div>
      ) : tab === "players" ? (
        <PlayerLeaderboard
          rankings={playerRankings}
          highlightedIds={highlightedPlayerIds}
          onSelect={setSelectedEntry}
        />
      ) : (
        <CountryLeaderboard rankings={countryRankings} highlightedIds={highlightedCountryIds} />
      )}

      <PlayerCardModal entry={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </div>
  );
}
