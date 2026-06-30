import type { MatchupResponse } from "@/lib/types";
import { preloadImageLinks, preloadImages } from "@/lib/ui-utils";

export interface PrefetchedMatchup {
  matchup: MatchupResponse;
  imagesReady: boolean;
}

export async function fetchMatchupFromApi(): Promise<MatchupResponse> {
  const response = await fetch("/api/matchup");
  if (!response.ok) {
    throw new Error("Failed to load matchup");
  }
  return response.json() as Promise<MatchupResponse>;
}

export async function warmMatchupImages(matchup: MatchupResponse): Promise<void> {
  const urls = matchup.players.map((player) => player.imageUrl);
  preloadImageLinks(urls);
  await preloadImages(urls);
}

/** Background prefetch queue for the next head-to-head. */
export class MatchupPrefetcher {
  private prefetch: PrefetchedMatchup | null = null;
  private inFlight: Promise<PrefetchedMatchup | null> | null = null;

  get ready(): boolean {
    return this.prefetch?.imagesReady === true;
  }

  peek(): MatchupResponse | null {
    return this.prefetch?.imagesReady ? this.prefetch.matchup : null;
  }

  consume(): MatchupResponse | null {
    if (!this.prefetch?.imagesReady) {
      return null;
    }

    const matchup = this.prefetch.matchup;
    this.prefetch = null;
    return matchup;
  }

  schedule(excludeMatchupId?: string): void {
    if (this.inFlight) {
      return;
    }

    if (this.prefetch?.imagesReady && this.prefetch.matchup.matchupId !== excludeMatchupId) {
      return;
    }

    this.inFlight = this.loadNext(excludeMatchupId).finally(() => {
      this.inFlight = null;
    });
  }

  async waitForReady(timeoutMs = 2500): Promise<MatchupResponse | null> {
    if (this.prefetch?.imagesReady) {
      return this.consume();
    }

    if (!this.inFlight) {
      this.schedule();
    }

    const deadline = Date.now() + timeoutMs;

    while (Date.now() < deadline) {
      if (this.inFlight) {
        await this.inFlight;
      }

      if (this.prefetch?.imagesReady) {
        return this.consume();
      }

      await new Promise((resolve) => setTimeout(resolve, 40));
    }

    return null;
  }

  private async loadNext(excludeMatchupId?: string): Promise<PrefetchedMatchup | null> {
    try {
      const matchup = await fetchMatchupFromApi();

      if (excludeMatchupId && matchup.matchupId === excludeMatchupId) {
        return null;
      }

      await warmMatchupImages(matchup);
      const entry: PrefetchedMatchup = { matchup, imagesReady: true };
      this.prefetch = entry;
      return entry;
    } catch {
      return null;
    }
  }
}
