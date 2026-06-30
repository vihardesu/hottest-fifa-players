import type { Metadata } from "next";
import { Fredoka, Inter } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import { getOgImageUrl, getOpenGraphImages } from "@/lib/og-metadata";
import { getSiteUrl } from "@/lib/site-url";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  variable: "--font-fredoka",
  display: "swap",
});

const title = "FIFA Face-Off";
const description =
  "Vote on the hottest FIFA 2026 players in head-to-head matchups. Pick your favorite face and climb the live leaderboard.";

export const metadata: Metadata = {
  metadataBase: new URL(getSiteUrl()),
  title,
  description,
  openGraph: {
    title,
    description,
    url: getSiteUrl(),
    siteName: title,
    locale: "en_US",
    type: "website",
    images: getOpenGraphImages(),
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [getOgImageUrl()],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fredoka.variable} ${inter.variable} h-full scroll-smooth`}>
      <body className="flex min-h-dvh flex-col bg-[#EDE8D0] text-[#4F4D46] antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
