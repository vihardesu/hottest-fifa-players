import Image from "next/image";
import { getFlagUrl } from "@/lib/country-flags";

interface CountryFlagProps {
  country: string;
  countryCode?: string | null;
  className?: string;
}

export function CountryFlag({ country, countryCode, className }: CountryFlagProps) {
  const flagUrl = getFlagUrl(countryCode);

  return (
    <span className={`inline-flex max-w-full items-center gap-1 text-inherit md:gap-2 ${className ?? ""}`}>
      {flagUrl ? (
        <Image
          src={flagUrl}
          alt=""
          width={28}
          height={21}
          className="h-3 w-4 shrink-0 rounded-[2px] object-cover shadow-sm ring-1 ring-[#D4CDB8]/80 md:h-5 md:w-7"
          aria-hidden
        />
      ) : (
        <span className="size-3 shrink-0 rounded-full bg-[#D4CDB8]/60 md:size-5" aria-hidden />
      )}
      <span className="truncate">{country}</span>
    </span>
  );
}
