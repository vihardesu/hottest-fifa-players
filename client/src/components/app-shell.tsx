"use client";

import { usePathname } from "next/navigation";
import { Trophy01 } from "@untitledui/icons";
import { Button } from "@/components/base/buttons/button";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isLeaderboard = pathname === "/leaderboard";

  return (
    <div className="flex min-h-full flex-col bg-[#EDE8D0]">
      <header className="sticky top-0 z-20 border-b border-[#D4CDB8]/60 bg-[#EDE8D0]/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-4 py-4 md:px-8">
          <h1 className="text-lg font-bold tracking-tight text-[#4F4D46] md:text-2xl">
            FIFA Face-Off
          </h1>
          {isLeaderboard ? (
            <Button href="/" color="secondary" size="md" className="border-[#D4CDB8] bg-[#FAF7F0] text-[#4F4D46] shadow-md">
              Vote
            </Button>
          ) : (
            <Button
              href="/leaderboard"
              color="secondary"
              size="md"
              iconLeading={Trophy01}
              className="border-2 border-[#C4A882] bg-[#FAF7F0] px-5 text-[#4F4D46] shadow-md ring-1 ring-[#D4CDB8]/50 transition hover:border-[#B8A070] hover:bg-[#F5F0E4] hover:shadow-lg"
            >
              Leaderboard
            </Button>
          )}
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-6 md:px-8 md:py-10">
        {children}
      </main>
    </div>
  );
}
