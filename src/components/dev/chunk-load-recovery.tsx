"use client";

import { useEffect } from "react";

const RELOAD_KEY = "ito-dev-asset-reload";

function hasAppStylesheet(): boolean {
  return Array.from(document.styleSheets).some((sheet) => {
    try {
      return Boolean(sheet.href?.includes("/_next/static/css"));
    } catch {
      return false;
    }
  });
}

/**
 * Dev-only: backup recovery when inline head script did not reload in time.
 */
export function ChunkLoadRecovery() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const reloadOnce = (reason: string) => {
      const attempts = Number(sessionStorage.getItem(RELOAD_KEY) ?? "0");
      if (attempts >= 3) return;
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
      if (!url.includes("/_next/")) return;
      reloadOnce(`failed to load ${url}`);
    };

    window.addEventListener("error", onError, true);

    const checkTimer = window.setTimeout(() => {
      const hasShell = Boolean(document.querySelector("[data-ito-shell]"));
      const hasHydrated = Boolean(
        document.querySelector("[data-dashboard-ready], [data-project-board]")
      );
      const hasCss = hasAppStylesheet();

      if (hasHydrated && hasCss) {
        sessionStorage.removeItem(RELOAD_KEY);
        return;
      }

      if (hasShell && !hasCss) {
        reloadOnce("stylesheets missing (unstyled page)");
        return;
      }

      const skeleton = document.querySelector("[data-dashboard-skeleton]");
      if (skeleton && !hasHydrated) {
        reloadOnce("stuck loading skeleton");
      }
    }, 3500);

    return () => {
      window.removeEventListener("error", onError, true);
      window.clearTimeout(checkTimer);
    };
  }, []);

  return null;
}
