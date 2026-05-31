"use client";

import { useEffect } from "react";
import { markStylesReady } from "@/lib/is-styles-ready";

/** Sync boot guard with React hydration — only clears when Tailwind layout works */
export function StyleBootComplete() {
  useEffect(() => {
    const tryComplete = () => markStylesReady();

    if (tryComplete()) return;

    const id = window.setInterval(() => {
      if (tryComplete()) window.clearInterval(id);
    }, 40);

    return () => window.clearInterval(id);
  }, []);

  return null;
}
