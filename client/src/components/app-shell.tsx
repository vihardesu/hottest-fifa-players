"use client";

import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/base/buttons/button";
import { Tab, TabList, Tabs } from "@/components/application/tabs/tabs";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const isLeaderboard = pathname === "/leaderboard";
  const selectedTab = isLeaderboard ? "leaderboard" : "matchup";

  return (
    <div className="flex min-h-full flex-col bg-primary">
      <header className="sticky top-0 z-20 border-b border-secondary bg-primary/95 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between px-4 py-4 md:px-6">
          <h1 className="text-lg font-semibold text-primary md:text-xl">FIFA Face-Off</h1>
          <Button
            href={isLeaderboard ? "/" : "/leaderboard"}
            color="link-color"
            size="sm"
          >
            {isLeaderboard ? "Vote" : "Board"}
          </Button>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 md:px-6">{children}</main>

      <footer className="sticky bottom-0 z-20 border-t border-secondary bg-primary/95 backdrop-blur">
        <div className="mx-auto w-full max-w-3xl px-4 py-3 md:px-6 md:py-4">
          <Tabs
            selectedKey={selectedTab}
            onSelectionChange={(key) => router.push(key === "leaderboard" ? "/leaderboard" : "/")}
            className="w-full"
          >
            <TabList type="button-border" size="md" fullWidth className="w-full">
              <Tab id="matchup" label="Matchup" className="flex-1" />
              <Tab id="leaderboard" label="Leaderboard" className="flex-1" />
            </TabList>
          </Tabs>
        </div>
      </footer>
    </div>
  );
}
