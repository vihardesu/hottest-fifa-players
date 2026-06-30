import Link from "next/link";
import type { ReactNode } from "react";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <article className="flex flex-1 flex-col gap-6 pb-4">
      <div>
        <Link
          href="/"
          className="text-sm text-[#4F4D46]/60 underline-offset-2 transition hover:text-[#4F4D46] hover:underline"
        >
          ← Back to voting
        </Link>
        <h1 className="mt-3 text-2xl font-bold text-[#4F4D46] md:text-3xl">{title}</h1>
        <p className="mt-1 text-sm text-[#4F4D46]/55">Last updated: {lastUpdated}</p>
      </div>
      <div className="space-y-6 text-sm leading-relaxed text-[#4F4D46]/85 md:text-base [&_blockquote]:mt-2 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-[#4F4D46] md:[&_h2]:text-lg [&_ol]:mt-2 [&_ol]:list-decimal [&_ol]:space-y-1 [&_ol]:pl-5 [&_p]:mt-2 [&_ul]:mt-2 [&_ul]:list-disc [&_ul]:space-y-1 [&_ul]:pl-5">
        {children}
      </div>
    </article>
  );
}
