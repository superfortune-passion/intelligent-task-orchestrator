"use client";

import { useEffect } from "react";

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

/** Sync boot guard with React hydration — only clears when Tailwind layout works */
export function StyleBootComplete() {
  useEffect(() => {
    const root = document.documentElement;

    const tryComplete = () => {
      if (!utilitiesReady()) return false;
      root.classList.remove("ito-boot-pending");
      root.classList.add("ito-styles-ready");
      sessionStorage.removeItem("ito-style-boot");
      sessionStorage.removeItem("ito-chunk-recovery");
      return true;
    };

    if (tryComplete()) return;

    const id = window.setInterval(() => {
      if (tryComplete()) window.clearInterval(id);
    }, 40);

    return () => window.clearInterval(id);
  }, []);

  return null;
}
