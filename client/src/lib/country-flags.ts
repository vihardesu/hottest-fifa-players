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

export function getFlagUrl(countryCode: string | null | undefined): string | null {
  if (!countryCode) {
    return null;
  }

  const slug = FIFA_FLAG_SLUG[countryCode.toUpperCase()];
  if (!slug) {
    return null;
  }

  return `https://flagcdn.com/24x18/${slug}.png`;
}
