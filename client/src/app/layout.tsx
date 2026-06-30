import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { AppShell } from "@/components/app-shell";
import "@/styles/globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "FIFA Face-Off",
  description: "Vote on the hottest FIFA 2026 players in head-to-head matchups.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full scroll-smooth`}>
      <body className="min-h-full bg-primary text-primary antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
