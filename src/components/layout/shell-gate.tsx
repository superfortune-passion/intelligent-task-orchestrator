"use client";

import { useEffect, useState } from "react";

function utilitiesReady(): boolean {
  if (typeof document === "undefined" || !document.body) return false;
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
 * Client gate: do not paint the shell until Tailwind layout utilities are active.
 */
export function ShellGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tryReady = () => {
      const root = document.documentElement;
      if (!utilitiesReady()) return false;
      root.classList.remove("ito-boot-pending");
      root.classList.add("ito-styles-ready");
      sessionStorage.removeItem("ito-style-boot");
      setReady(true);
      return true;
    };

    if (tryReady()) return;

    const onClassChange = () => {
      if (tryReady()) observer.disconnect();
    };

    const observer = new MutationObserver(onClassChange);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const interval = window.setInterval(() => {
      if (tryReady()) window.clearInterval(interval);
    }, 40);

    const timeout = window.setTimeout(() => {
      if (!utilitiesReady()) {
        const attempts = Number(sessionStorage.getItem("ito-style-boot") ?? "0");
        if (attempts < 5) {
          sessionStorage.setItem("ito-style-boot", String(attempts + 1));
          window.location.reload();
        }
      }
    }, 6000);

    return () => {
      observer.disconnect();
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, []);

  if (!ready) return null;

  return <>{children}</>;
}
