/** FIFA 3-letter codes → flagcdn.com slug (ISO 3166-1 or regional). */
const FIFA_FLAG_SLUG: Record<string, string> = {
  ALG: "dz",
  ARG: "ar",
  AUS: "au",
  AUT: "at",
  BEL: "be",
  BIH: "ba",
  BRA: "br",
  CPV: "cv",
  CAN: "ca",
  COL: "co",
  COD: "cd",
  CIV: "ci",
  CRO: "hr",
  CUW: "cw",
  CZE: "cz",
  ECU: "ec",
  EGY: "eg",
  ENG: "gb-eng",
  FRA: "fr",
  GER: "de",
  GHA: "gh",
  HAI: "ht",
  IRN: "ir",
  IRQ: "iq",
  JPN: "jp",
  JOR: "jo",
  KOR: "kr",
  MEX: "mx",
  MAR: "ma",
  NED: "nl",
  NZL: "nz",
  NOR: "no",
  PAN: "pa",
  PAR: "py",
  POR: "pt",
  QAT: "qa",
  KSA: "sa",
  SCO: "gb-sct",
  SEN: "sn",
  RSA: "za",
  ESP: "es",
  SWE: "se",
  SUI: "ch",
  TUN: "tn",
  TUR: "tr",
  URU: "uy",
  USA: "us",
  UZB: "uz",
};

export function getFlagUrl(
  countryCode: string | null | undefined,
  width = 24,
): string | null {
  if (!countryCode) {
    return null;
  }

  const slug = FIFA_FLAG_SLUG[countryCode.toUpperCase()];
  if (!slug) {
    return null;
  }

  // flagcdn rejects some `w{width}` values (e.g. w24 → 404); WxH is reliable.
  const height = Math.round((width * 18) / 24);
  return `https://flagcdn.com/${width}x${height}/${slug}.png`;
}
