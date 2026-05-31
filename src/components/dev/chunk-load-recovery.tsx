"use client";

import { useEffect } from "react";

const RELOAD_KEY = "ito-chunk-recovery";

function utilitiesReady(): boolean {
  if (!document.body) return false;
  const cssLink = document.querySelector('link[href*="/_next/static/css"]');
  if (!cssLink || !(cssLink as HTMLLinkElement).sheet) return false;

  const hidden = document.createElement("div");
  hidden.className = "hidden";
  document.body.appendChild(hidden);
  const hiddenOk = getComputedStyle(hidden).display === "none";
  hidden.remove();
  if (!hiddenOk) return false;

  const layout = document.createElement("div");
  layout.className = "flex fixed";
  document.body.appendChild(layout);
  const st = getComputedStyle(layout);
  const ok = st.display === "flex" && st.position === "fixed";
  layout.remove();
  return ok;
}

/**
 * React backup: fast recovery if inline boot script did not reload in time.
 */
export function ChunkLoadRecovery() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const reloadOnce = (reason: string) => {
      const bootKey = "ito-style-boot";
      const attempts = Math.max(
        Number(sessionStorage.getItem(RELOAD_KEY) ?? "0"),
        Number(sessionStorage.getItem(bootKey) ?? "0")
      );
      if (attempts >= 3) return;
      sessionStorage.setItem(RELOAD_KEY, String(attempts + 1));
      sessionStorage.setItem(bootKey, String(attempts + 1));
      console.warn(`[ITO] Chunk recovery: ${reason}`);
      window.location.reload();
    };

    if (
      document.body?.textContent?.trim() === "Internal Server Error" ||
      document.body?.textContent?.includes("Internal Server Error")
    ) {
      reloadOnce("server 500");
      return;
    }

    const onError = (event: Event) => {
      const target = event.target;
      if (
        !(target instanceof HTMLLinkElement) &&
        !(target instanceof HTMLScriptElement)
      ) {
        return;
      }
      const url =
        target instanceof HTMLLinkElement ? target.href : target.src;
      if (!url.includes("/_next/")) return;
      reloadOnce(`failed asset ${url}`);
    };

    window.addEventListener("error", onError, true);

    const timers = [400, 1200, 2800].map((ms) =>
      window.setTimeout(() => {
        if (document.documentElement.classList.contains("ito-styles-ready")) {
          sessionStorage.removeItem(RELOAD_KEY);
          return;
        }

        const hasShell = Boolean(document.querySelector("[data-ito-shell]"));
        if (!hasShell) return;

        if (!utilitiesReady()) {
          reloadOnce("tailwind inactive after hydration");
          return;
        }

        const hasHydrated = Boolean(
          document.querySelector(
            "[data-dashboard-ready], [data-project-board], [data-projects-ready]"
          )
        );
        const skeleton = document.querySelector("[data-dashboard-skeleton]");
        if (skeleton && !hasHydrated) {
          reloadOnce("stuck skeleton");
        }
      }, ms)
    );

    return () => {
      window.removeEventListener("error", onError, true);
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return null;
}
