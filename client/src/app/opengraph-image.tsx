import { ImageResponse } from "next/og";

export const alt =
  "FIFA Face-Off — vote on head-to-head matchups between FIFA World Cup 2026 players";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

async function loadFredoka(weight: number): Promise<ArrayBuffer> {
  const css = await fetch(
    `https://fonts.googleapis.com/css2?family=Fredoka:wght@${weight}`,
    { headers: { "User-Agent": "Mozilla/5.0 (compatible; OG/1.0)" } },
  ).then((response) => response.text());

  const match = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype|woff2)'\)/);
  if (!match?.[1]) {
    throw new Error("Failed to load Fredoka font");
  }

  return fetch(match[1]).then((response) => response.arrayBuffer());
}

function PlayerCard({
  name,
  faceColor,
}: {
  name: string;
  faceColor: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: 280,
        border: "3px solid #D4CDB8",
        borderRadius: 28,
        background: "#FAF7F0",
        overflow: "hidden",
        boxShadow: "0 16px 40px rgba(79, 77, 70, 0.12)",
      }}
    >
      <div
        style={{
          display: "flex",
          height: 280,
          alignItems: "center",
          justifyContent: "center",
          background: "#E8E2D0",
        }}
      >
        <div
          style={{
            width: 130,
            height: 130,
            borderRadius: "50%",
            background: faceColor,
            border: "4px solid #FAF7F0",
          }}
        />
      </div>
      <div
        style={{
          display: "flex",
          borderTop: "2px solid #D4CDB8",
          background: "linear-gradient(180deg, #F5F0E4 0%, #EDE8D0 100%)",
          padding: "18px 16px",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: "#4F4D46",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          {name}
        </div>
      </div>
    </div>
  );
}

export default async function Image() {
  const [fredokaSemiBold, fredokaBold] = await Promise.all([loadFredoka(600), loadFredoka(700)]);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          flexDirection: "column",
          background: "#EDE8D0",
          padding: "48px 56px",
          fontFamily: "Fredoka",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 36,
          }}
        >
          <div style={{ display: "flex", fontSize: 44, fontWeight: 700, color: "#4F4D46" }}>
            FIFA Face-Off
          </div>
          <div
            style={{
              display: "flex",
              width: 52,
              height: 52,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "50%",
              border: "2px solid #D4CDB8",
              background: "#FAF7F0",
              fontSize: 28,
            }}
          >
            ⚽
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            marginBottom: 40,
            fontSize: 52,
            fontWeight: 700,
            color: "#4F4D46",
          }}
        >
          <span>🔥</span>
          <span>Who&apos;s hotter?</span>
          <span>😍</span>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            alignItems: "center",
            justifyContent: "center",
            gap: 40,
          }}
        >
          <PlayerCard name="Cody Gakpo" faceColor="#C4A882" />
          <div
            style={{
              display: "flex",
              border: "2px solid #D4CDB8",
              borderRadius: 999,
              background: "#FAF7F0",
              padding: "12px 28px",
              fontSize: 22,
              fontWeight: 700,
              color: "rgba(79, 77, 70, 0.6)",
              letterSpacing: "0.2em",
            }}
          >
            VS
          </div>
          <PlayerCard name="Kylian Mbappé" faceColor="#D4CDB8" />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: 32,
            fontSize: 24,
            color: "rgba(79, 77, 70, 0.65)",
          }}
        >
          Vote on the hottest FIFA 2026 players · Live leaderboard
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Fredoka", data: fredokaSemiBold, weight: 600, style: "normal" },
        { name: "Fredoka", data: fredokaBold, weight: 700, style: "normal" },
      ],
    },
  );
}
