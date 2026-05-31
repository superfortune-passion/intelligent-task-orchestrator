"use client";

import { useEffect } from "react";

const RELOAD_KEY = "ito-dev-asset-reload";
const HYDRATION_KEY = "ito-hydration-reload";

/**
 * Dev-only: recover from stale /_next chunks, failed main-app.js, or stuck dashboard skeleton.
 */
export function ChunkLoadRecovery() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const reloadOnce = (key: string, reason: string) => {
      const attempts = Number(sessionStorage.getItem(key) ?? "0");
      if (attempts >= 2) return;
      sessionStorage.setItem(key, String(attempts + 1));
      console.warn(`[dev] Recovering: ${reason}`);
      window.location.reload();
    };

    if (
      document.body?.childNodes.length <= 1 &&
      document.body?.textContent?.trim() === "Internal Server Error"
    ) {
      reloadOnce(RELOAD_KEY, "server 500 stale build");
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
      reloadOnce(RELOAD_KEY, `failed to load ${url}`);
    };

    window.addEventListener("error", onError, true);

    const stuckTimer = window.setTimeout(() => {
      const skeleton = document.querySelector("[data-dashboard-skeleton]");
      const hasHero = document.querySelector("[data-dashboard-ready]");
      if (skeleton && !hasHero) {
        reloadOnce(
          HYDRATION_KEY,
          "client bundle did not hydrate (stuck loading skeleton)"
        );
      }
    }, 4000);

    const resetIfHealthy = () => {
      const hasAppCss = Array.from(document.styleSheets).some((sheet) => {
        try {
          return Boolean(sheet.href?.includes("/_next/static/css"));
        } catch {
          return false;
        }
      });
      const hasContent = Boolean(
        document.querySelector("[data-dashboard-ready], [data-project-board]")
      );
      if (hasAppCss || hasContent) {
        sessionStorage.removeItem(RELOAD_KEY);
        sessionStorage.removeItem(HYDRATION_KEY);
      }
    };

    resetIfHealthy();
    const healthTimer = window.setTimeout(resetIfHealthy, 1500);

    return () => {
      window.removeEventListener("error", onError, true);
      window.clearTimeout(stuckTimer);
      window.clearTimeout(healthTimer);
    };
  }, []);

  return null;
}
