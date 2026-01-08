// Safe performance utilities. No DOM/window access at module top-level.

export function preloadCriticalResources(): void {
  if (typeof window === "undefined") return;

  try {
    // Example: preconnect or preload any critical resources if needed.
    // Keep this minimal and safe.
    const link = document.createElement("link");
    link.rel = "preconnect";
    link.href = "https://fonts.gstatic.com";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);
  } catch {
    // noop
  }
}

export function registerServiceWorker(): void {
  if (typeof window === "undefined") return;

  if ("serviceWorker" in navigator) {
    // register in the background, ignore errors
    navigator.serviceWorker
      .register("/service-worker.js")
      .catch(() => {
        /* ignore registration failures */
      });
  }
}
