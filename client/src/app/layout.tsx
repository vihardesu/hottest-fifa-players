import type { Metadata } from "next";
import { Fredoka, Inter } from "next/font/google";
import { AppShell } from "@/components/app-shell";
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

export const metadata: Metadata = {
  title: "FIFA Face-Off",
  description: "Vote on the hottest FIFA 2026 players in head-to-head matchups.",
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
