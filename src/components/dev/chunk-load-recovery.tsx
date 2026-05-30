"use client";

import { useEffect } from "react";

const RELOAD_KEY = "ito-dev-asset-reload";

/**
 * Dev-only: reload once when /_next/static assets 404 after HMR (Windows webpack issue).
 */
export function ChunkLoadRecovery() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development") return;

    const onError = (event: Event) => {
      const target = event.target;
      if (
        !(target instanceof HTMLLinkElement) &&
        !(target instanceof HTMLScriptElement)
      ) {
        return;
      }
      const url =
        target instanceof HTMLLinkElement
          ? target.href
          : target.src;
      if (!url.includes("/_next/static")) return;

      const attempts = Number(sessionStorage.getItem(RELOAD_KEY) ?? "0");
      if (attempts >= 2) return;

      sessionStorage.setItem(RELOAD_KEY, String(attempts + 1));
      window.location.reload();
    };

    window.addEventListener("error", onError, true);

    const resetIfStyled = () => {
      const hasAppCss = Array.from(document.styleSheets).some((sheet) => {
        try {
          return Boolean(sheet.href?.includes("/_next/static/css"));
        } catch {
          return false;
        }
      });
      if (hasAppCss) sessionStorage.removeItem(RELOAD_KEY);
    };

    resetIfStyled();
    const timer = window.setTimeout(resetIfStyled, 2000);

    return () => {
      window.removeEventListener("error", onError, true);
      window.clearTimeout(timer);
    };
  }, []);

  return null;
}
