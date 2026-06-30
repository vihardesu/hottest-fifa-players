import {
  getCountryLeaderboard,
  maybeRunRatingPeriod,
  subscribeToCountryRankings,
} from "@/lib/players";

export const dynamic = "force-dynamic";

const POLL_INTERVAL_MS = 60_000;

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      let closed = false;

      const close = () => {
        if (closed) {
          return;
        }
        closed = true;
        clearInterval(poll);
        clearInterval(heartbeat);
        unsubscribe();
        try {
          controller.close();
        } catch {
          // already closed
        }
      };

      const enqueue = (chunk: string) => {
        if (closed) {
          return;
        }
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          close();
        }
      };

      const send = (payload: unknown) => {
        enqueue(`data: ${JSON.stringify(payload)}\n\n`);
      };

      const pushRankings = async (type: "initial" | "ranking_update") => {
        const rankings = await getCountryLeaderboard();
        if (closed) {
          return;
        }
        send({ type, rankings });
      };

      const unsubscribe = subscribeToCountryRankings((rankings) => {
        send({ type: "ranking_update", rankings });
      });

      void pushRankings("initial").catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Failed to load country leaderboard";
        send({ type: "error", message });
      });

      const poll = setInterval(() => {
        void (async () => {
          try {
            await maybeRunRatingPeriod();
            await pushRankings("ranking_update");
          } catch (error: unknown) {
            const message =
              error instanceof Error ? error.message : "Failed to refresh country leaderboard";
            send({ type: "error", message });
          }
        })();
      }, POLL_INTERVAL_MS);

      const heartbeat = setInterval(() => {
        enqueue(": heartbeat\n\n");
      }, 15000);

      request.signal.addEventListener("abort", close);
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
