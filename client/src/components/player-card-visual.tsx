import { CountryFlag } from "@/components/country-flag";
import { formatPlayerStats } from "@/lib/player-format";
import { cx } from "@/utils/cx";

export interface PlayerCardVisualProps {
  name: string;
  imageUrl: string;
  country?: string;
  countryCode?: string | null;
  birthDate?: string | null;
  heightCm?: number | null;
  rank?: number;
  subtitle?: string;
  className?: string;
}

export function PlayerCardVisual({
  name,
  imageUrl,
  country,
  countryCode,
  birthDate,
  heightCm,
  rank,
  subtitle,
  className,
}: PlayerCardVisualProps) {
  const stats = formatPlayerStats(birthDate, heightCm);

  return (
    <div
      className={cx(
        "relative flex w-full flex-col overflow-hidden rounded-xl border-2 border-[#D4CDB8] bg-[#FAF7F0] shadow-lg",
        "max-md:h-auto md:h-full md:min-h-0",
        "md:rounded-3xl md:border-[3px] md:shadow-xl",
        className,
      )}
    >
      {rank !== undefined && (
        <span className="absolute top-1.5 left-1.5 z-10 rounded-full border-2 border-[#D4CDB8] bg-[#FAF7F0]/95 px-2 py-0.5 text-xs font-bold text-[#4F4D46] md:top-4 md:left-4 md:px-4 md:py-1 md:text-lg">
          #{rank}
        </span>
      )}

      <div className="relative shrink-0 overflow-hidden bg-[#E8E2D0] md:min-h-0 md:flex-1">
        <div className="player-face-crop player-face-crop--card aspect-square w-full md:aspect-[4/5] md:h-auto md:flex-none">
          <img
            src={imageUrl}
            alt={name}
            className="player-face-image"
            fetchPriority="high"
            decoding="async"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/5" />
      </div>

      <div className="relative flex shrink-0 flex-col gap-0.5 border-t-2 border-[#D4CDB8] bg-gradient-to-b from-[#F5F0E4] to-[#EDE8D0] px-2 py-2 md:gap-2.5 md:px-5 md:py-5">
        <p className="truncate text-center text-[11px] font-semibold uppercase leading-tight tracking-wide text-[#4F4D46] md:text-xl">
          {name}
        </p>

        {country && (
          <p className="flex justify-center text-[10px] font-medium leading-tight text-[#4F4D46]/70 md:text-base">
            <CountryFlag country={country} countryCode={countryCode} />
          </p>
        )}

        {stats && (
          <p className="hidden text-center text-sm font-medium text-[#4F4D46]/55 md:block md:text-base">
            {stats}
          </p>
        )}

        {subtitle && (
          <p className="hidden text-center text-sm font-medium text-[#4F4D46]/55 md:block md:text-base">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
