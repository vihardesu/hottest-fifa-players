"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThumbsUp, Trophy01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";
import { cx } from "@/utils/cx";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isLeaderboard = pathname === "/leaderboard";
  const isVotingPage = pathname === "/";

  return (
    <div
      className={cx(
        "flex min-h-dvh w-full flex-1 flex-col bg-[#EDE8D0]",
        isVotingPage && "h-dvh max-h-dvh overflow-hidden",
      )}
    >
      <header
        className={cx(
          "z-20 shrink-0 bg-[#EDE8D0]",
          isVotingPage
            ? "relative pt-[max(0.25rem,env(safe-area-inset-top))]"
            : "sticky top-0",
        )}
      >
        <div
          className={cx(
            "flex w-full items-center justify-between px-3 md:px-4",
            isVotingPage ? "py-2 md:py-4" : "py-3 md:py-4",
          )}
        >
          <h1
            className={cx(
              "font-semibold text-[#4F4D46]",
              isVotingPage ? "text-lg md:text-3xl" : "text-xl md:text-3xl",
            )}
          >
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
              className="border-2 border-[#C4A882] bg-[#FAF7F0] px-3 py-2 text-xs md:px-5 md:text-sm text-[#4F4D46] shadow-md ring-1 ring-[#D4CDB8]/50 transition hover:border-[#B8A070] hover:bg-[#F5F0E4] hover:shadow-lg"
            >
              Leaderboard
            </Button>
          ) : null}
        </div>
      </header>

      <main
        className={cx(
          "mx-auto flex w-full max-w-5xl min-h-0 flex-1 flex-col",
          isVotingPage
            ? "overflow-hidden px-2 pb-1 pt-0 md:overflow-visible md:px-8 md:pb-10 md:pt-4"
            : "px-4 pb-6 pt-2 md:px-8 md:pb-10 md:pt-4",
        )}
      >
        {children}
      </main>

      <footer
        className={cx(
          "shrink-0 bg-[#EDE8D0]",
          isVotingPage &&
            "pb-[max(0.25rem,env(safe-area-inset-bottom))] pt-1 md:py-4",
        )}
      >
        <div
          className={cx(
            "flex items-center justify-end gap-2 px-3 text-[#4F4D46]/50 md:gap-3 md:px-4",
            isVotingPage ? "text-[10px] md:text-xs" : "py-4 text-xs",
          )}
        >
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
