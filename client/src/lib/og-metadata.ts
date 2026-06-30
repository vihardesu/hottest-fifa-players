import { getSiteUrl } from "@/lib/site-url";

export const OG_IMAGE_ALT =
  "FIFA Face-Off landing page showing a head-to-head player vote matchup";

export const OG_IMAGE_SIZE = {
  width: 1024,
  height: 589,
} as const;

/** Primary OG image served from the site URL (`/opengraph-image`). */
export function getOgImageUrl(): string {
  return `${getSiteUrl()}/opengraph-image`;
}

/** Static fallback OG image in `/public`. */
export function getOgImageFallbackUrl(): string {
  return `${getSiteUrl()}/og-preview.jpg`;
}

export function getOpenGraphImages() {
  return [
    {
      url: getOgImageUrl(),
      ...OG_IMAGE_SIZE,
      alt: OG_IMAGE_ALT,
      type: "image/jpeg",
    },
    {
      url: getOgImageFallbackUrl(),
      ...OG_IMAGE_SIZE,
      alt: OG_IMAGE_ALT,
      type: "image/jpeg",
    },
  ];
}
