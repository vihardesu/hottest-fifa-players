function preloadImage(src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = () => resolve();
    img.src = src;
  });
}

function preloadImages(urls: string[]): Promise<void> {
  return Promise.all(urls.map((url) => preloadImage(url))).then(() => undefined);
}

const injectedPreloads = new Set<string>();

/** Hint the browser to fetch upcoming player photos early. */
function preloadImageLinks(urls: string[]): void {
  if (typeof document === "undefined") {
    return;
  }

  for (const url of urls) {
    if (injectedPreloads.has(url)) {
      continue;
    }

    injectedPreloads.add(url);
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = url;
    document.head.appendChild(link);
  }
}

function formatLastUpdated(date: Date): string {
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export { preloadImage, preloadImages, preloadImageLinks, formatLastUpdated };
