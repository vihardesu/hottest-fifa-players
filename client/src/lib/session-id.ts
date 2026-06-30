const STORAGE_KEY = "fifa-faceoff-session";

/** Stable per-browser session id for vote attribution and rate limits. */
export function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    const existing = localStorage.getItem(STORAGE_KEY);
    if (existing) {
      return existing;
    }

    const id = crypto.randomUUID();
    localStorage.setItem(STORAGE_KEY, id);
    return id;
  } catch {
    return crypto.randomUUID();
  }
}
