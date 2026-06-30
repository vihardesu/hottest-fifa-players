"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThumbsUp, Trophy01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isLeaderboard = pathname === "/leaderboard";
  const isVotingPage = pathname === "/";

  return (
    <div className="flex min-h-dvh w-full flex-1 flex-col bg-[#EDE8D0]">
      <header className="sticky top-0 z-20 bg-[#EDE8D0]">
        <div className="flex w-full items-center justify-between px-3 py-3 md:px-4 md:py-4">
          <h1 className="text-xl font-semibold text-[#4F4D46] md:text-3xl">
            FIFA Face-Off
          </h1>
          {isLeaderboard ? (
            <Button
              href="/"
              color="secondary"
              size="md"
              iconLeading={ThumbsUp}
              className="border-[#D4CDB8] bg-[#FAF7F0] px-5 text-[#4F4D46] shadow-md"
            >
              Vote
            </Button>
          ) : isVotingPage ? (
            <Button
              href="/leaderboard"
              color="secondary"
              size="md"
              iconLeading={Trophy01}
              className="border-2 border-[#C4A882] bg-[#FAF7F0] px-5 text-[#4F4D46] shadow-md ring-1 ring-[#D4CDB8]/50 transition hover:border-[#B8A070] hover:bg-[#F5F0E4] hover:shadow-lg"
            >
              Leaderboard
            </Button>
          ) : null}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 pb-6 pt-2 md:px-8 md:pb-10 md:pt-4">
        {children}
      </main>

      <footer className="bg-[#EDE8D0]">
        <div className="flex items-center justify-end gap-2 px-3 py-4 text-xs text-[#4F4D46]/50 md:gap-3 md:px-4">
          <Link
            href="/methodology"
            className="underline-offset-2 transition hover:text-[#4F4D46]/75 hover:underline"
          >
            Methodology
          </Link>
          <span aria-hidden="true">·</span>
          <Link
            href="/terms"
            className="underline-offset-2 transition hover:text-[#4F4D46]/75 hover:underline"
          >
            Terms of Service
          </Link>
          <span aria-hidden="true">·</span>
          <Link
            href="/privacy"
            className="underline-offset-2 transition hover:text-[#4F4D46]/75 hover:underline"
          >
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}
