"use client";

import { useEffect } from "react";

/** Ensures boot guard clears after React hydrates with Tailwind active */
export function StyleBootComplete() {
  useEffect(() => {
    const root = document.documentElement;

    const tryComplete = () => {
      if (!document.body) return false;
      const probe = document.createElement("div");
      probe.className = "hidden";
      document.body.appendChild(probe);
      const ready = getComputedStyle(probe).display === "none";
      probe.remove();
      if (!ready) return false;
      root.classList.remove("ito-boot-pending");
      root.classList.add("ito-styles-ready");
      sessionStorage.removeItem("ito-style-boot");
      sessionStorage.removeItem("ito-chunk-recovery");
      return true;
    };

    if (tryComplete()) return;

    const id = window.setInterval(() => {
      if (tryComplete()) window.clearInterval(id);
    }, 50);

    return () => window.clearInterval(id);
  }, []);

  return null;
}
