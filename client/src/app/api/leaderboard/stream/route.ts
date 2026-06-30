import { getLeaderboard, subscribeToRankings } from "@/lib/players";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    start(controller) {
      const send = (payload: unknown) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
      };

      const unsubscribe = subscribeToRankings((rankings) => {
        send({ type: "ranking_update", rankings });
      });

      void getLeaderboard()
        .then((rankings) => {
          send({ type: "initial", rankings });
        })
        .catch((error: unknown) => {
          const message = error instanceof Error ? error.message : "Failed to load leaderboard";
          send({ type: "error", message });
        });

      const heartbeat = setInterval(() => {
        controller.enqueue(encoder.encode(": heartbeat\n\n"));
      }, 15000);

      request.signal.addEventListener("abort", () => {
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
