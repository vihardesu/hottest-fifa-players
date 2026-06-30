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
        "relative flex flex-col overflow-hidden rounded-2xl border-2 border-[#D4CDB8] bg-[#FAF7F0] shadow-lg",
        "md:rounded-3xl md:border-[3px] md:shadow-xl",
        className,
      )}
    >
      {rank !== undefined && (
        <span className="absolute top-3 left-3 z-10 rounded-full border-2 border-[#D4CDB8] bg-[#FAF7F0]/95 px-3 py-1 text-base font-bold text-[#4F4D46] md:top-4 md:left-4 md:px-4 md:text-lg">
          #{rank}
        </span>
      )}

      <div className="relative overflow-hidden bg-[#E8E2D0]">
        <div className="player-face-crop aspect-square w-full md:aspect-[4/5]">
          <img src={imageUrl} alt={name} className="player-face-image" />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-black/5" />
      </div>

      <div className="relative flex flex-col gap-2 border-t-2 border-[#D4CDB8] bg-gradient-to-b from-[#F5F0E4] to-[#EDE8D0] px-4 py-4 md:gap-2.5 md:px-5 md:py-5">
        <p className="truncate text-center text-base font-semibold uppercase tracking-wide text-[#4F4D46] md:text-xl">
          {name}
        </p>

        {country && (
          <p className="flex justify-center text-sm font-medium text-[#4F4D46]/70 md:text-base">
            <CountryFlag country={country} countryCode={countryCode} />
          </p>
        )}

        {stats && (
          <p className="text-center text-sm font-medium text-[#4F4D46]/55 md:text-base">{stats}</p>
        )}

        {subtitle && (
          <p className="text-center text-sm font-medium text-[#4F4D46]/55 md:text-base">{subtitle}</p>
        )}
      </div>
    </div>
  );
}
