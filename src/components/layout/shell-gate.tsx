"use client";

import { useEffect, useState } from "react";
import { isStylesReady, markStylesReady } from "@/lib/is-styles-ready";

/**
 * Client gate: do not paint the shell until Tailwind layout utilities are active.
 */
export function ShellGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const tryReady = () => {
      if (!isStylesReady()) return false;
      markStylesReady();
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
      if (!isStylesReady()) {
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
