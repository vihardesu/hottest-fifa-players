import { getLeaderboard, maybeRunRatingPeriod, subscribeToRankings } from "@/lib/players";

export const dynamic = "force-dynamic";

const POLL_INTERVAL_MS = 60_000;

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      const pushRankings = async (type: "initial" | "ranking_update") => {
        const rankings = await getLeaderboard();
        send({ type, rankings });
      };

      const unsubscribe = subscribeToRankings((rankings) => {
        send({ type: "ranking_update", rankings });
      });

      void pushRankings("initial").catch((error: unknown) => {
        const message = error instanceof Error ? error.message : "Failed to load leaderboard";
        send({ type: "error", message });
      });

      const poll = setInterval(() => {
        void (async () => {
          try {
            await maybeRunRatingPeriod();
            await pushRankings("ranking_update");
          } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "Failed to refresh leaderboard";
            send({ type: "error", message });
          }
        })();
      }, POLL_INTERVAL_MS);

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": heartbeat\n\n"));
      }, 15000);

      request.signal.addEventListener("abort", () => {
        clearInterval(poll);
        clearInterval(heartbeat);
        unsubscribe();
        controller.close();
      });
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
