"use client";

import { useEffect } from "react";

const RELOAD_KEY = "ito-dev-asset-reload";

/**
 * Dev-only: recover from stale /_next assets or plain "Internal Server Error" after HMR.
 */
export function ChunkLoadRecovery() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const reloadOnce = (reason: string) => {
      const attempts = Number(sessionStorage.getItem(RELOAD_KEY) ?? "0");
      if (attempts >= 2) return;
      sessionStorage.setItem(RELOAD_KEY, String(attempts + 1));
      console.warn(`[dev] Recovering: ${reason}`);
      window.location.reload();
    };

    if (
      document.body?.childNodes.length <= 1 &&
      document.body?.textContent?.trim() === "Internal Server Error"
    ) {
      reloadOnce("server 500 stale build");
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
      if (!url.includes("/_next/static")) return;
      reloadOnce(`failed to load ${url}`);
    };

    window.addEventListener("error", onError, true);

    const resetIfHealthy = () => {
      const hasAppCss = Array.from(document.styleSheets).some((sheet) => {
        try {
          return Boolean(sheet.href?.includes("/_next/static/css"));
        } catch {
          return false;
        }
      });
      const hasContent = Boolean(
        document.querySelector(".app-gradient, main, [data-ito-shell]")
      );
      if (hasAppCss || hasContent) {
        sessionStorage.removeItem(RELOAD_KEY);
      }
    };

    resetIfHealthy();
    const timer = window.setTimeout(resetIfHealthy, 2000);

    return () => {
      window.removeEventListener("error", onError, true);
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
